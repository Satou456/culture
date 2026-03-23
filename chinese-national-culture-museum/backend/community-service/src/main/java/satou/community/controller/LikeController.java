package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.result.Result;
import satou.community.service.LikeService;

@Slf4j
@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
@Tag(name = "点赞接口", description = "点赞相关接口")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/post/{id}")
    @Operation(summary = "点赞作品", description = "点赞指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Void> likePost(@PathVariable("id") String id) {
        log.info("点赞作品: id={}", id);
        likeService.likePost(id);
        return Result.success();
    }

    @DeleteMapping("/post/{id}")
    @Operation(summary = "取消点赞", description = "取消点赞指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Void> unlikePost(@PathVariable("id") String id) {
        log.info("取消点赞: id={}", id);
        likeService.unlikePost(id);
        return Result.success();
    }

    @GetMapping("/post/{id}/status")
    @Operation(summary = "检查点赞状态", description = "检查当前用户是否已点赞指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Boolean> checkLikeStatus(@PathVariable("id") String id) {
        log.info("检查点赞状态: id={}", id);
        boolean isLiked = likeService.isLiked(id);
        return Result.success(isLiked);
    }
}
