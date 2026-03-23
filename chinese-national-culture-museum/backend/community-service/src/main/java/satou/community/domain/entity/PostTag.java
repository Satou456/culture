package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("post_tag")
public class PostTag {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String tagId;

    private String postId;
}