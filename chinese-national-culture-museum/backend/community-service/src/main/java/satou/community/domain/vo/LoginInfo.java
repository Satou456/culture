package satou.community.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录信息")
public class LoginInfo {
    @Schema(description = "用户id")
    private String id;
    @Schema(description = "用户名")
    private String username;
    @Schema(description = "token")
    private String token;
}
