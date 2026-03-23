package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("tags")
public class Tags {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    private String name;

    private Integer topicCount;
}