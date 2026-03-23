package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import satou.community.domain.entity.Message;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {

    /**
     * 获取两个用户之间的聊天记录（按时间正序）
     */
    List<Message> getConversation(@Param("userId") String userId, 
                                  @Param("friendId") String friendId, 
                                  @Param("offset") int offset, 
                                  @Param("limit") int limit);

    /**
     * 获取某用户的最近联系人列表（按最后一条消息时间倒序）
     * 注意：这里需要关联查询获取对方用户名，也可以在Service层处理，这里简化为查Message
     * 更优方案是返回一个包含最新消息和对方信息的VO，此处先提供基础查询
     */
    List<Message> getRecentContacts(@Param("userId") String userId, @Param("limit") int limit);
    
    /**
     * 获取某用户收到的未读消息数量
     */
    Long getUnreadCount(@Param("userId") String userId, @Param("senderId") String senderId);
}