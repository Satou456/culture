package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.result.Result;
import satou.community.domain.vo.PostDetailVO;
import satou.community.service.CollectService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/collects")
@RequiredArgsConstructor
@Tag(name = "收藏接口", description = "收藏相关接口")
public class CollectController {

    private final CollectService collectService;

    @PostMapping("/post/{id}")
    @Operation(summary = "收藏作品", description = "收藏指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Void> collectPost(@PathVariable("id") String id) {
        log.info("收藏作品: id={}", id);
        collectService.collectPost(id);
        return Result.success();
    }

    @DeleteMapping("/post/{id}")
    @Operation(summary = "取消收藏", description = "取消收藏指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Void> uncollectPost(@PathVariable("id") String id) {
        log.info("取消收藏: id={}", id);
        collectService.uncollectPost(id);
        return Result.success();
    }

    @GetMapping("/post/{id}/status")
    @Operation(summary = "检查收藏状态", description = "检查当前用户是否已收藏指定作品")
    @Parameter(name = "id", description = "作品id", in = io.swagger.v3.oas.annotations.enums.ParameterIn.PATH)
    public Result<Boolean> checkCollectStatus(@PathVariable("id") String id) {
        log.info("检查收藏状态: id={}", id);
        boolean isCollected = collectService.isCollected(id);
        return Result.success(isCollected);
    }

    @GetMapping
    @Operation(summary = "获取我的收藏列表", description = "获取当前用户收藏的作品列表")
    public Result<List<PostDetailVO>> getMyCollects(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        log.info("获取我的收藏列表: page={}, size={}", page, size);
        List<PostDetailVO> list = collectService.getMyCollects(page, size);
        return Result.success(list);
    }

}
