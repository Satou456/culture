package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("post")
public class Post {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    private String title;

    private String content;

    private String fileUrl;

    private String userId;

    private String ethnicGroup;

    private String region;

    private Integer visibility;

    private Integer comments;

    private Integer collects;

    private Integer likeCount;

    private Boolean top;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifyTime;
}