// Friend.java
package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("follow")
public class Friend {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String userId;

    private String friendId;

    /**
     * 好友状态 0-待同意 1-已同意 2-已拒绝
     */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}