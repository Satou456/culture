package satou.community.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "发送私信DTO")
public class SendMessageDTO {
    @NotBlank(message = "接收者用户名不能为空")
    @Schema(description = "接收者用户名")
    private String receiverUsername; // 接收者用户名

    @NotBlank(message = "消息内容不能为空")
    @Schema(description = "消息内容")
    private String content;          // 消息内容
}