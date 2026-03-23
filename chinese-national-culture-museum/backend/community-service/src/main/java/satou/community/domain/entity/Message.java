package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("message")
public class Message {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    private String senderId;

    private String receiverId;

    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}