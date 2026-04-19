package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.dto.PostCreateDTO;
import satou.community.domain.vo.PostDetailVO;
import satou.community.domain.result.Result;
import satou.community.service.PostService;
import cn.dev33.satoken.stp.StpUtil;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "文章接口", description = "文章相关接口")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "创建并发布文章", description = "创建并发布文章接口")
    public Result<Void> create(@RequestBody PostCreateDTO postCreateDTO) {
        log.info("创建并发布文章: {}", postCreateDTO);
        postService.createPost(postCreateDTO);
        return Result.success();
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取文章详情", description = "获取文章详情接口")
    @Parameter(name = "id", description = "文章id", in = ParameterIn.PATH)
    public Result<PostDetailVO> detail(@PathVariable("id") String id) {
        log.info("获取文章详情: {}", id);
        PostDetailVO vo = postService.getPostDetail(id);
        return Result.success(vo);
    }

    @GetMapping
    @Operation(summary = "获取文章列表", description = "获取文章列表接口")
    @Parameters({
            @Parameter(name = "userId", description = "用户id", in = ParameterIn.QUERY),
            @Parameter(name = "page", description = "页码", in = ParameterIn.QUERY),
            @Parameter(name = "size", description = "每页数量", in = ParameterIn.QUERY),
            @Parameter(name = "sortType", description = "排序类型: latest(最新), hottest(最热)", in = ParameterIn.QUERY)
    })
    public Result<List<PostDetailVO>> list(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortType", defaultValue = "latest") String sortType) {

        log.info("获取文章列表: userId={}, page={}, size={}, sortType={}", userId, page, size, sortType);
        List<PostDetailVO> list = postService.listPosts(userId, page, size, sortType);
        return Result.success(list);
    }

    @GetMapping("/recommend")
    @Operation(summary = "获取推荐文章列表", description = "调用推荐逻辑获取首页推荐文章")
    public Result<List<PostDetailVO>> recommend() {
        log.info("获取推荐文章列表");
        List<PostDetailVO> list = postService.recommendPost();
        return Result.success(list);
    }

    @DeleteMapping
    @Operation(summary = "删除文章", description = "删除文章接口")
    @Parameter(name = "id", description = "文章id", in = ParameterIn.QUERY)
    public Result<Void> delete(@RequestParam("id") String id) {
        log.info("删除文章: {}", id);
        postService.deletePost(id);
        return Result.success();
    }

    @GetMapping("/my")
    @Operation(summary = "获取我的文章列表", description = "获取当前登录用户的文章列表")
    public Result<List<PostDetailVO>> getMyPosts() {
        String currentUserId = StpUtil.getLoginIdAsString();
        log.info("获取当前用户的文章列表: userId={}", currentUserId);
        List<PostDetailVO> list = postService.listPosts(currentUserId, 1, 100, "latest"); // 只获取第一页，最多100条
        return Result.success(list);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新文章", description = "更新文章接口")
    @Parameter(name = "id", description = "文章id", in = ParameterIn.PATH)
    public Result<Void> update(@PathVariable("id") String id, @RequestBody PostCreateDTO postCreateDTO) {
        log.info("更新文章: id={}, data={}", id, postCreateDTO);
        postService.updatePost(id, postCreateDTO);
        return Result.success();
    }

}