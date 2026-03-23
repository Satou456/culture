// FriendMapper.java
package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import satou.community.domain.entity.Friend;

@Mapper
public interface FriendMapper extends BaseMapper<Friend> {
    
    /**
     * 检查两人是否已是好友
     */
    @Select("SELECT COUNT(*) FROM follow WHERE " +
            "((user_id = #{userId} AND friend_id = #{friendId}) OR " +
            "(user_id = #{friendId} AND friend_id = #{userId})) " +
            "AND status = 1")
    Integer checkIsFriend(@Param("userId") String userId, @Param("friendId") String friendId);
    
    /**
     * 检查是否存在待处理的好友申请
     */
    @Select("SELECT COUNT(*) FROM follow WHERE user_id = #{userId} AND friend_id = #{friendId} AND status = 0")
    Integer checkPendingRequest(@Param("userId") String userId, @Param("friendId") String friendId);
}