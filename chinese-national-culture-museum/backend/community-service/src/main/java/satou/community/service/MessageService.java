package satou.community.service;

import satou.community.domain.dto.SendMessageDTO;
import satou.community.domain.vo.MessageVO;

import java.util.List;

public interface MessageService {

    /**
     * 发送私信
     * @param dto 发送内容
     */
    void sendMessage(SendMessageDTO dto);

    /**
     * 获取与某好友的聊天记录
     * @param friendUsername 好友用户名
     * @param page 页码
     * @param size 每页数量
     * @return 消息列表
     */
    List<MessageVO> getConversation(String friendUsername, int page, int size);

    /**
     * 获取最近聊天列表
     */
    List<MessageVO> getRecentContacts(int page, int size);
}