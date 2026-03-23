// FriendService.java
package satou.community.service;

import satou.community.domain.dto.FriendApproveDTO;
import satou.community.domain.vo.FriendVO;

import java.util.List;

public interface FriendService {
    
    /**
     * 添加好友（发送好友请求）
     */
    void addFriend(String friendUsername);
    
    /**
     * 处理好友请求（同意/拒绝）
     */
    void approveFriend(FriendApproveDTO dto);
    
    /**
     * 获取好友列表
     */
    List<FriendVO> getFriendList(String userId);
    
    /**
     * 获取好友申请列表
     */
    List<FriendVO> getFriendRequestList();
    
    /**
     * 删除好友
     */
    void deleteFriend(String friendId);
}