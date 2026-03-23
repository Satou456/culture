package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import satou.community.domain.dto.ChangePasswordDTO;
import satou.community.domain.dto.LoginDTO;
import satou.community.domain.dto.ProfileDTO;
import satou.community.domain.dto.RegisterDTO;
import satou.community.domain.entity.User;
import satou.community.domain.vo.LoginInfo;
import satou.community.domain.vo.ProfileVO;
import satou.community.exception.BusinessException;
import satou.community.mapper.UserMapper;
import satou.community.service.UserService;
import satou.community.utils.BeanCopyUtils;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User register(RegisterDTO registerDTO) {

        // 校验邮箱是否存在
        User existUser = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, registerDTO.getEmail()));

        if (existUser != null) {
            throw new BusinessException("该邮箱已被注册");
        }

        // 校验密码
        if (!registerDTO.getPassword().equals(registerDTO.getCheckPass())) {
            throw new BusinessException("两次输入的密码不一致");
        }

        // 校验用户名
        User existUserByUsername = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, registerDTO.getUsername()));

        if (existUserByUsername != null) {
            throw new BusinessException("该用户名已被注册");
        }

        // 构建用户实体
        User user = User.builder()
                .email(registerDTO.getEmail())
                .username(registerDTO.getUsername())
                .password(registerDTO.getPassword())
                .build();

        // 插入数据库
        baseMapper.insert(user);

        return user;
    }

    @Override
    public LoginInfo login(LoginDTO loginDTO) {

        User user = this.getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, loginDTO.getUsername()));

        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new BusinessException("密码错误");
        }

        // Sa-Token 登录，传入用户ID作为登录标识
        StpUtil.login(user.getId());

        return new LoginInfo(user.getId(), user.getUsername(), StpUtil.getTokenValue());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProfile(ProfileDTO profileDTO) {
        String userId = StpUtil.getLoginIdAsString();

        // 更新用户信息
        userMapper.updateProfile(userId, profileDTO);
    }

    @Override
    public ProfileVO getUserById(String id) {
        // 通过id查询用户信息
        User user = baseMapper.selectById(id);
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        return BeanCopyUtils.copyBean(user, ProfileVO.class);
    }

    @Override
    public String getUsernameByUserId(String friendId) {
        // 通过id查询用户信息
        User user = baseMapper.selectById(friendId);
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        return user.getUsername();
    }

    @Override
    public String getNicknameByUserId(String friendId) {
        // 通过id查询用户信息
        User user = baseMapper.selectById(friendId);
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        return user.getNickname();
    }

    @Override
    public String getAvatarByUserId(String friendId) {
        // 通过id查询用户信息
        User user = baseMapper.selectById(friendId);
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        return user.getAvatar();
    }

    @Override
    public String getUserIdByUsername(String friendUsername) {
        // 通过用户名查询用户ID
        User user = baseMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, friendUsername));
        if (ObjectUtils.isEmpty(user)) {
            return null;
        }
        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePassword(ChangePasswordDTO dto) {
        String userId = StpUtil.getLoginIdAsString();

        // 查询用户
        User user = baseMapper.selectById(userId);
        if (ObjectUtils.isEmpty(user)) {
            throw new BusinessException("用户不存在");
        }

        // 验证当前密码
        if (!user.getPassword().equals(dto.getCurrentPassword())) {
            throw new BusinessException("当前密码错误");
        }

        // 验证新密码和确认密码
        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new BusinessException("两次输入的密码不一致");
        }

        // 更新密码
        user.setPassword(dto.getNewPassword());
        baseMapper.updateById(user);

        log.info("用户 [{}] 密码修改成功", userId);
    }

    @Override
    public List<User> searchUsers(String username) {
        // 模糊查询用户名
        return baseMapper.selectList(new LambdaQueryWrapper<User>()
                .like(User::getUsername, username)
                .select(User::getId, User::getUsername, User::getNickname, User::getAvatar));
    }
}
