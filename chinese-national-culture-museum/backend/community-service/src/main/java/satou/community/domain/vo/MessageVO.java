package satou.community.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Schema(description = "私信VO")
public class MessageVO {
    @Schema(description = "消息ID")
    private String id;
    @Schema(description = "发送者ID")
    private String senderId;
    @Schema(description = "发送者用户名")
    private String senderUsername; // 发送者用户名（方便前端显示）
    @Schema(description = "发送者昵称")
    private String senderNickname;
    @Schema(description = "发送者头像")
    private String avatar;
    @Schema(description = "接收者ID")
    private String receiverId;
    @Schema(description = "消息内容")
    private String content;
    @Schema(description = "创建时间")
    private LocalDateTime createTime;
}