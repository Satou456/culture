package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.entity.Comment;
import satou.community.domain.result.Result;
import satou.community.domain.vo.CommentVO;
import satou.community.service.CommentService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "评论接口", description = "评论相关接口")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @Operation(summary = "创建评论", description = "创建新评论或回复")
    public Result<Void> createComment(@RequestBody Comment comment) {
        log.info("创建评论: postId={}, content={}", comment.getPostId(), comment.getContent());
        commentService.createComment(comment);
        return Result.success();
    }

    @GetMapping("/post/{postId}")
    @Operation(summary = "获取帖子评论", description = "获取指定帖子的评论列表")
    public Result<List<CommentVO>> getCommentsByPostId(@PathVariable("postId") String postId) {
        log.info("获取帖子评论: postId={}", postId);
        List<CommentVO> comments = commentService.getCommentsByPostId(postId);
        return Result.success(comments);
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "删除评论", description = "删除指定评论")
    public Result<Void> deleteComment(@PathVariable("commentId") String commentId) {
        log.info("删除评论: commentId={}", commentId);
        commentService.deleteComment(commentId);
        return Result.success();
    }

}
