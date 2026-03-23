package satou.community.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "用户信息传输对象")
public class ProfileDTO {
    @Schema(description = "用户昵称")
    private String nickname;
    @Schema(description = "用户头像")
    private String avatar;
    @Schema(description = "用户横幅")
    private String banner;
    @Schema(description = "用户简介")
    private String bio;
    @Schema(description = "用户手机号")
    private String mobile;
    @Schema(description = "用户邮箱")
    private String email;
    @Schema(description = "民族")
    private String ethnicGroup;
    @Schema(description = "省份")
    private String province;
    @Schema(description = "城市")
    private String city;
    @Schema(description = "兴趣标签")
    private List<String> interestTags;
}
