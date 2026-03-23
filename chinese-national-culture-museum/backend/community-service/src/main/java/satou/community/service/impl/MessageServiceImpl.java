package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import satou.community.domain.dto.SendMessageDTO;
import satou.community.domain.entity.Message;
import satou.community.domain.result.Result;
import satou.community.domain.vo.MessageVO;
import satou.community.exception.BusinessException;
import satou.community.mapper.FriendMapper;
import satou.community.mapper.MessageMapper;
import satou.community.service.MessageService;
import satou.community.utils.BeanCopyUtils;
import satou.community.websocket.WebSocketServer;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageMapper messageMapper;
    private final UserServiceImpl userService; // 复用已有的User服务查ID
    private final FriendMapper friendMapper;
    private final WebSocketServer webSocketServer;

    @Override
    public void sendMessage(SendMessageDTO dto) {
        String currentUserId = StpUtil.getLoginIdAsString();

        // 1. 获取接收者ID
        String receiverId = userService.getUserIdByUsername(dto.getReceiverUsername());
        if (receiverId == null) {
            throw new BusinessException("接收者用户不存在");
        }

        // 2. 检查是否是好友 (只能给好友发消息)
        Integer isFriend = friendMapper.checkIsFriend(currentUserId, receiverId);
        if (isFriend == null || isFriend == 0) {
            throw new BusinessException("只能给好友发送私信");
        }

        // 3. 构建并保存消息
        Message message = new Message();
        message.setSenderId(currentUserId);
        message.setReceiverId(receiverId);
        message.setContent(dto.getContent());

        messageMapper.insert(message);

        // 4. 【核心】构建推送数据
        MessageVO vo = BeanCopyUtils.copyBean(message, MessageVO.class);
        // 填充发送者名字，方便前端显示
        vo.setSenderUsername(userService.getUsernameByUserId(currentUserId));
        vo.setSenderNickname(userService.getNicknameByUserId(currentUserId));
        vo.setAvatar(userService.getAvatarByUserId(currentUserId));

        // 包装成 Result 对象，保持与 HTTP 接口返回格式一致
        Result<MessageVO> pushData = Result.success(vo);

        // 5. 推送给接收者 (如果在线)
        webSocketServer.sendToUser(receiverId, pushData);

        // 6. (可选) 推送给发送者自己 (用于多端同步)
        // webSocketServer.sendToUser(currentUserId, pushData);

        log.info("消息已保存并尝试推送：{} -> {}", currentUserId, receiverId);
    }

    @Override
    public List<MessageVO> getConversation(String friendUsername, int page, int size) {
        String currentUserId = StpUtil.getLoginIdAsString();
        String friendId = userService.getUserIdByUsername(friendUsername);

        if (friendId == null) {
            throw new BusinessException("好友不存在");
        }

        // 校验是否好友
        Integer isFriend = friendMapper.checkIsFriend(currentUserId, friendId);
        if (isFriend == null || isFriend == 0) {
            throw new BusinessException("你们不是好友，无法查看聊天记录");
        }

        int offset = (page - 1) * size;
        List<Message> messages = messageMapper.getConversation(currentUserId, friendId, offset, size);

        return messages.stream().map(msg -> {
            MessageVO vo = BeanCopyUtils.copyBean(msg, MessageVO.class);
            // 填充发送者用户名、昵称和头像
            if (msg.getSenderId().equals(currentUserId)) {
                vo.setSenderUsername("我"); // 或者填自己的用户名
                vo.setSenderNickname(userService.getNicknameByUserId(currentUserId));
                vo.setAvatar(userService.getAvatarByUserId(currentUserId));
            } else {
                vo.setSenderUsername(friendUsername);
                vo.setSenderNickname(userService.getNicknameByUserId(friendId));
                vo.setAvatar(userService.getAvatarByUserId(friendId));
            }
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<MessageVO> getRecentContacts(int page, int size) {
        String currentUserId = StpUtil.getLoginIdAsString();
        int offset = (page - 1) * size;
        // 这里的Mapper方法需要调整支持分页，或者在内存中分页。
        // 为简化，假设getRecentContacts返回所有最近联系人最新一条，这里做截取
        List<Message> messages = messageMapper.getRecentContacts(currentUserId, 100); // 先查多一点

        if (messages.isEmpty()) {
            return List.of();
        }

        // 过滤掉非好友的联系人（只保留当前好友的聊天记录）
        List<Message> friendMessages = messages.stream().filter(msg -> {
            // 确定对方是谁
            String partnerId = msg.getSenderId().equals(currentUserId) ? msg.getReceiverId() : msg.getSenderId();
            // 检查是否还是好友
            Integer isFriend = friendMapper.checkIsFriend(currentUserId, partnerId);
            return isFriend != null && isFriend > 0;
        }).toList();

        // 内存分页 (实际生产建议在XML里写好分页)
        int start = Math.min(offset, friendMessages.size());
        int end = Math.min(offset + size, friendMessages.size());
        if (start >= end)
            return List.of();

        List<Message> pageMessages = friendMessages.subList(start, end);

        return pageMessages.stream().map(msg -> {
            MessageVO vo = BeanCopyUtils.copyBean(msg, MessageVO.class);
            // 确定对方是谁
            String partnerId = msg.getSenderId().equals(currentUserId) ? msg.getReceiverId() : msg.getSenderId();
            vo.setSenderUsername(userService.getUsernameByUserId(partnerId));
            vo.setSenderNickname(userService.getNicknameByUserId(partnerId));
            vo.setAvatar(userService.getAvatarByUserId(partnerId));
            return vo;
        }).collect(Collectors.toList());
    }
}