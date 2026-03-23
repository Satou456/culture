// FriendServiceImpl.java
package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import satou.community.domain.dto.FriendApproveDTO;
import satou.community.domain.entity.Friend;
import satou.community.domain.enums.FriendStatusEnum;
import satou.community.domain.vo.FriendVO;
import satou.community.exception.BusinessException;
import satou.community.mapper.FriendMapper;
import satou.community.service.FriendService;
import satou.community.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {

    private final FriendMapper friendMapper;
    private final UserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addFriend(String friendUsername) {
        String userId = StpUtil.getLoginIdAsString();

        // 根据用户名查询好友ID
        String friendId = userService.getUserIdByUsername(friendUsername);
        if (friendId == null) {
            throw new BusinessException("用户不存在");
        }

        // 不能添加自己为好友
        if (userId.equals(friendId)) {
            throw new BusinessException("不能添加自己为好友");
        }

        // 检查是否已是好友
        Integer isFriend = friendMapper.checkIsFriend(userId, friendId);
        if (isFriend != null && isFriend > 0) {
            throw new BusinessException("你们已经是好友了");
        }

        // 检查是否存在待处理的申请
        Integer pending = friendMapper.checkPendingRequest(userId, friendId);
        if (pending != null && pending > 0) {
            throw new BusinessException("好友申请已发送，等待对方同意");
        }

        // 检查对方是否已发送申请给我（直接同意）
        Integer reversePending = friendMapper.checkPendingRequest(friendId, userId);
        if (reversePending != null && reversePending > 0) {
            // 对方已申请，直接建立双向好友关系
            acceptFriendRequest(friendId, userId);
            return;
        }

        // 创建好友申请记录（待同意状态）
        Friend friend = new Friend();
        friend.setUserId(userId);
        friend.setFriendId(friendId);
        friend.setStatus(FriendStatusEnum.PENDING.getCode());
        friendMapper.insert(friend);

        log.info("用户{}向用户{}发送好友申请", userId, friendId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approveFriend(FriendApproveDTO dto) {
        String userId = StpUtil.getLoginIdAsString();
        Integer friendApproveIdId = dto.getFriendApproveId();
        Integer type = dto.getType();

        // 查询好友申请记录
        Friend friendRecord = friendMapper.selectById(friendApproveIdId);
        if (friendRecord == null) {
            throw new BusinessException("好友申请记录不存在");
        }

        // 验证是否是接收方操作
        if (!friendRecord.getFriendId().equals(userId)) {
            throw new BusinessException("无权操作此好友申请");
        }

        // 检查状态是否为待同意
        if (!friendRecord.getStatus().equals(FriendStatusEnum.PENDING.getCode())) {
            throw new BusinessException("该申请已处理");
        }

        if (type == 1) {
            // 同意 - 建立双向好友关系
            acceptFriendRequest(friendRecord.getUserId(), friendRecord.getFriendId());
        } else {
            // 拒绝 - 直接删除申请记录
            friendMapper.deleteById(friendApproveIdId);
            log.info("用户{}拒绝了用户{}的好友申请，已删除申请记录", userId, friendRecord.getUserId());
        }

        log.info("用户{}处理好友申请，结果：{}", userId, type == 1 ? "同意" : "拒绝");
    }

    private void acceptFriendRequest(String userId, String friendId) {
        // 更新原申请记录为已同意
        LambdaQueryWrapper<Friend> queryWrapper = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getUserId, userId)
                .eq(Friend::getFriendId, friendId)
                .eq(Friend::getStatus, FriendStatusEnum.PENDING.getCode());
        Friend originalRecord = friendMapper.selectOne(queryWrapper);
        if (originalRecord != null) {
            originalRecord.setStatus(FriendStatusEnum.ACCEPTED.getCode());
            friendMapper.updateById(originalRecord);
        }

        // 创建反向好友记录
        Friend reverseFriend = new Friend();
        reverseFriend.setUserId(friendId);
        reverseFriend.setFriendId(userId);
        reverseFriend.setStatus(FriendStatusEnum.ACCEPTED.getCode());

        // 避免重复插入（唯一索引）
        LambdaQueryWrapper<Friend> reverseQuery = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getUserId, friendId)
                .eq(Friend::getFriendId, userId);
        Long count = friendMapper.selectCount(reverseQuery);
        if (count == 0) {
            friendMapper.insert(reverseFriend);
        }
    }

    @Override
    public List<FriendVO> getFriendList(String userId) {
        LambdaQueryWrapper<Friend> queryWrapper = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getUserId, userId)
                .eq(Friend::getStatus, FriendStatusEnum.ACCEPTED.getCode());

        List<Friend> friends = friendMapper.selectList(queryWrapper);

        return friends.stream().map(friend -> {
            FriendVO vo = new FriendVO();
            vo.setId(friend.getId());
            vo.setFriendId(friend.getFriendId());
            vo.setFriendUsername(userService.getUsernameByUserId(friend.getFriendId()));
            vo.setFriendNickname(userService.getNicknameByUserId(friend.getFriendId()));
            vo.setAvatar(userService.getAvatarByUserId(friend.getFriendId()));
            vo.setStatus(friend.getStatus());
            vo.setStatusDesc(FriendStatusEnum.ACCEPTED.getDesc());
            vo.setCreateTime(friend.getCreateTime());
            vo.setOnline(false); // 暂时默认离线，实际项目中可以根据用户在线状态设置
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<FriendVO> getFriendRequestList() {
        String userId = StpUtil.getLoginIdAsString();
        LambdaQueryWrapper<Friend> queryWrapper = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getFriendId, userId)
                .eq(Friend::getStatus, FriendStatusEnum.PENDING.getCode());

        List<Friend> requests = friendMapper.selectList(queryWrapper);

        return requests.stream().map(friend -> {
            FriendVO vo = new FriendVO();
            vo.setId(friend.getId());
            vo.setFriendId(friend.getUserId());
            vo.setFriendUsername(userService.getUsernameByUserId(friend.getUserId()));
            vo.setStatus(friend.getStatus());
            vo.setStatusDesc(FriendStatusEnum.PENDING.getDesc());
            vo.setCreateTime(friend.getCreateTime());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteFriend(String friendId) {
        String userId = StpUtil.getLoginIdAsString();
        // 删除双向好友关系
        LambdaQueryWrapper<Friend> wrapper1 = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getUserId, userId)
                .eq(Friend::getFriendId, friendId);
        friendMapper.delete(wrapper1);

        LambdaQueryWrapper<Friend> wrapper2 = new LambdaQueryWrapper<Friend>()
                .eq(Friend::getUserId, friendId)
                .eq(Friend::getFriendId, userId);
        friendMapper.delete(wrapper2);

        log.info("用户{}删除了好友{}", userId, friendId);
    }
}