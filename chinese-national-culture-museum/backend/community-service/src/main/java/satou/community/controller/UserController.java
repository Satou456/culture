package satou.community.controller;

import cn.dev33.satoken.stp.StpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.dto.ChangePasswordDTO;
import satou.community.domain.dto.LoginDTO;
import satou.community.domain.dto.ProfileDTO;
import satou.community.domain.dto.RegisterDTO;
import satou.community.domain.entity.User;
import satou.community.domain.result.Result;
import satou.community.domain.vo.LoginInfo;
import satou.community.domain.vo.ProfileVO;
import satou.community.service.UserService;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "用户接口", description = "用户的登录，注册，个人信息管理")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "用户注册接口")
    public Result<Void> register(@Valid @RequestBody RegisterDTO registerDTO) {
        log.info("注册接口");

        User user = userService.register(registerDTO);
        if (ObjectUtils.isEmpty(user)) {
            return Result.error("账号注册失败");
        }
        return Result.success();
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录接口")
    public Result<LoginInfo> login(@Valid @RequestBody LoginDTO loginDTO) {
        log.info("登录接口");
        LoginInfo loginInfo = userService.login(loginDTO);
        System.out.println(loginInfo.getToken());
        return Result.success(loginInfo);
    }

    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出接口")
    public Result<Object> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        StpUtil.logoutByTokenValue(token);
        log.info("Token [{}] 已注销", token);
        return Result.success();
    }

    @GetMapping("/{id}")
    @Operation(summary = "查看用户信息简介", description = "查查看用户信息简介接口")
    @Parameter(name = "用户id", description = "用户id", in = ParameterIn.PATH)
    public Result<ProfileVO> getProfile(@PathVariable("id") String id) {
        log.info("查看用户信息简介接口");

        ProfileVO userProfile = userService.getUserById(id);
        if (ObjectUtils.isEmpty(userProfile)) {
            return Result.error("用户不存在");
        }

        return Result.success(userProfile);
    }

    @PutMapping("/update")
    @Operation(summary = "更新用户信息", description = "更新用户信息接口")
    public Result<Void> updateProfile(@RequestBody ProfileDTO profileDTO) {
        log.info("更新用户信息接口");
        userService.updateProfile(profileDTO);
        return Result.success();
    }

    @GetMapping("/test")
    @Operation(summary = "测试接口", description = "测试接口")
    public Result<String> test() {
        log.info("测试接口");
        log.info("当前用户id：{}", StpUtil.getLoginId());
        return Result.success("测试成功");
    }

    @PostMapping("/change-password")
    @Operation(summary = "修改密码", description = "修改密码接口")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
        log.info("修改密码接口");
        userService.changePassword(changePasswordDTO);
        return Result.success();
    }

    @GetMapping("/search")
    @Operation(summary = "搜索用户", description = "通过用户名搜索用户")
    public Result<List<satou.community.domain.entity.User>> searchUsers(@RequestParam("username") String username) {
        log.info("搜索用户接口，搜索关键词：{}", username);
        List<satou.community.domain.entity.User> users = userService.searchUsers(username);
        return Result.success(users);
    }

}
