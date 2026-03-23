package satou.community.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;



@Data
@Schema(description = "注册参数")
public class RegisterDTO {
    @Schema(description = "邮箱")
    @NotEmpty(message = "请输入邮箱")
    private String email;

    @Schema(description = "用户名")
    @NotEmpty(message = "请输入账号")
    @Length(min = 2, max = 15, message = "长度在2-15")
    private String username;

    @Schema(description = "密码")
    @NotEmpty(message = "请输入密码")
    @Length(min = 6, max = 20, message = "长度在6-20")
    private String password;

    @Schema(description = "确认密码")
    @NotEmpty(message = "请再次输入密码")
    @Length(min = 6, max = 20, message = "长度在6-20")
    private String checkPass;
}