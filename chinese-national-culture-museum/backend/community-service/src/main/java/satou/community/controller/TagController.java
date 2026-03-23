package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.entity.Tags;
import satou.community.domain.result.Result;
import satou.community.domain.vo.PostDetailVO;
import satou.community.service.TagService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@Tag(name = "标签接口", description = "标签相关接口")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "获取标签列表", description = "获取所有标签列表")
    public Result<List<Tags>> getTags() {
        log.info("获取标签列表");
        List<Tags> tags = tagService.getTags();
        return Result.success(tags);
    }

    @GetMapping("/{tagName}/posts")
    @Operation(summary = "按标签获取帖子", description = "获取指定标签的帖子列表")
    public Result<List<PostDetailVO>> getPostsByTag(
            @PathVariable("tagName") String tagName,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        log.info("按标签获取帖子: tagName={}, page={}, size={}", tagName, page, size);
        List<PostDetailVO> posts = tagService.getPostsByTag(tagName, page, size);
        return Result.success(posts);
    }

}
