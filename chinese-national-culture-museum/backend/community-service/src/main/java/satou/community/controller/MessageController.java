package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.dto.SendMessageDTO;
import satou.community.domain.result.Result;
import satou.community.domain.vo.MessageVO;
import satou.community.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
@Tag(name = "私信接口", description = "发送私信、获取聊天记录、获取最近联系人")
public class MessageController {

    private final MessageService messageService;

    /**
     * 发送私信
     */
    @PostMapping("/send")
    @Operation(summary = "发送私信", description = "向好友发送私信")
    public Result<Void> sendMessage(@Valid @RequestBody SendMessageDTO dto) {
        messageService.sendMessage(dto);
        return Result.success();
    }

    /**
     * 获取聊天记录
     */
    @GetMapping("/conversation")
    @Operation(summary = "获取聊天记录", description = "获取与指定好友的聊天记录")
    public Result<List<MessageVO>> getConversation(
            @RequestParam("friendUsername") String friendUsername,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        
        List<MessageVO> list = messageService.getConversation(friendUsername, page, size);
        return Result.success(list);
    }

    /**
     * 获取最近聊天列表
     */
    @GetMapping("/recent")
    @Operation(summary = "获取最近聊天列表", description = "获取最近有互动的联系人列表")
    public Result<List<MessageVO>> getRecentContacts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        List<MessageVO> list = messageService.getRecentContacts(page, size);
        return Result.success(list);
    }
}