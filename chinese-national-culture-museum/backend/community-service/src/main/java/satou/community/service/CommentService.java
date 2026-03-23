package satou.community.service;

import com.baomidou.mybatisplus.extension.service.IService;
import satou.community.domain.entity.Comment;
import satou.community.domain.vo.CommentVO;

import java.util.List;

public interface CommentService extends IService<Comment> {

    /**
     * 创建评论
     * @param comment 评论实体
     */
    void createComment(Comment comment);

    /**
     * 获取帖子的评论列表（包含回复）
     * @param postId 帖子ID
     * @return 评论列表
     */
    List<CommentVO> getCommentsByPostId(String postId);

    /**
     * 回复评论
     * @param comment 评论实体（parentId不为null）
     */
    void replyComment(Comment comment);

    /**
     * 删除评论
     * @param commentId 评论ID
     */
    void deleteComment(String commentId);

}
