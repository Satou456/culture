package satou.community.controller; // 请根据实际包名调整

import cn.dev33.satoken.stp.StpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import satou.community.domain.dto.ProfileDTO;
import satou.community.domain.result.Result;
import satou.community.exception.BusinessException;
import satou.community.service.UserService;
import satou.community.utils.AliyunOSSOperator;

@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "文件上传", description = "文件上传相关接口")
public class UploadController {

    private final AliyunOSSOperator aliyunOSSOperator;
    private final UserService userService;

    @PostMapping("/upload")
    @Operation(summary = "上传文件", description = "上传图片到OSS，根据type参数决定是否更新用户头像")
    public Result<String> uploadFile(@RequestPart("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "avatar") String type) throws Exception {

        if (file.isEmpty()) {
            throw new BusinessException("上传文件不能为空");
        }

        if (!StpUtil.isLogin()) {
            throw new BusinessException("请先登录");
        }
        String currentUserId = StpUtil.getLoginIdAsString();
        log.info("当前用户ID: {}, 正在上传文件，类型: {}", currentUserId, type);

        // 上传到阿里云 OSS
        String originalFilename = file.getOriginalFilename();
        String fileUrl = null;
        if (originalFilename != null) {
            fileUrl = aliyunOSSOperator.upload(file.getBytes(), originalFilename);
        }
        log.info("文件上传成功，URL: {}", fileUrl);

        // 构建 DTO 并调用现有 Service 更新
        ProfileDTO profileDTO = new ProfileDTO();

        // 根据类型更新对应字段
        if ("avatar".equals(type)) {
            profileDTO.setAvatar(fileUrl);
            log.info("用户 [{}] 头像更新成功", currentUserId);
        } else if ("banner".equals(type)) {
            profileDTO.setBanner(fileUrl);
            log.info("用户 [{}] 横幅更新成功", currentUserId);
        } else {
            log.info("文件上传成功，未更新用户头像或横幅");
        }

        // 如果有更新字段，调用 Service 更新
        if (profileDTO.getAvatar() != null || profileDTO.getBanner() != null) {
            userService.updateProfile(profileDTO);
        }

        return Result.success(fileUrl);

    }

}