package satou.community.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "用户信息")
public class ProfileVO {

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "横幅")
    private String banner;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "手机")
    private String mobile;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "民族")
    private String ethnicGroup;

    @Schema(description = "省份")
    private String province;

    @Schema(description = "城市")
    private String city;

    @Schema(description = "个性标签")
    private List<String> interestTags;
}
