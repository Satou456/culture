package satou.community.service;

import com.baomidou.mybatisplus.extension.service.IService;
import jakarta.validation.Valid;
import satou.community.domain.dto.ChangePasswordDTO;
import satou.community.domain.dto.LoginDTO;
import satou.community.domain.dto.ProfileDTO;
import satou.community.domain.dto.RegisterDTO;
import satou.community.domain.entity.User;
import satou.community.domain.vo.LoginInfo;
import satou.community.domain.vo.ProfileVO;
import java.util.List;

public interface UserService extends IService<User> {
    User register(@Valid RegisterDTO registerDTO);

    LoginInfo login(@Valid LoginDTO loginDTO);

    void updateProfile(ProfileDTO dto);

    ProfileVO getUserById(@Valid String id);

    String getUsernameByUserId(String friendId);

    String getNicknameByUserId(String friendId);

    String getAvatarByUserId(String friendId);

    String getUserIdByUsername(String friendUsername);

    void changePassword(ChangePasswordDTO dto);

    List<User> searchUsers(String username);
}
