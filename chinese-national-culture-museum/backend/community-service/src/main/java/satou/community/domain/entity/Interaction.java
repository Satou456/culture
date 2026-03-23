package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("interaction")
public class Interaction {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String userId;

    private String targetId;

    private Integer targetType;

    private Integer actionType;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}