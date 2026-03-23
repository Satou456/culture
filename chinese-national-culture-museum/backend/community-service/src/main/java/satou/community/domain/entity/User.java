package satou.community.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName(value = "user", autoResultMap = true)
public class User {

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private String id;

    private String username;

    private String nickname;

    @JsonIgnore
    private String password;

    private String avatar;

    private String banner;

    private String email;

    private String mobile;

    private String bio;

    private String ethnicGroup;

    private String province;

    private String city;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> interestTags;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifyTime;
}