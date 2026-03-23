package satou.community.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import satou.community.domain.entity.Comment;
import satou.community.domain.entity.Post;
import satou.community.domain.entity.User;
import satou.community.domain.vo.CommentVO;
import satou.community.mapper.CommentMapper;
import satou.community.mapper.PostMapper;
import satou.community.mapper.UserMapper;
import satou.community.service.CommentService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    private final PostMapper postMapper;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public void createComment(Comment comment) {
        // 保存评论
        baseMapper.insert(comment);
        // 更新帖子评论数
        Post post = postMapper.selectById(comment.getPostId());
        if (post != null) {
            post.setComments(post.getComments() + 1);
            postMapper.updateById(post);
        }
    }

    @Override
    public List<CommentVO> getCommentsByPostId(String postId) {
        // 获取所有评论
        LambdaQueryWrapper<Comment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Comment::getPostId, postId);
        queryWrapper.orderByAsc(Comment::getCreateTime);
        List<Comment> comments = baseMapper.selectList(queryWrapper);

        // 构建评论树
        Map<String, CommentVO> commentMap = new HashMap<>();
        List<CommentVO> topComments = new ArrayList<>();

        // 先创建所有评论VO
        for (Comment comment : comments) {
            CommentVO commentVO = new CommentVO();
            commentVO.setId(comment.getId());
            commentVO.setContent(comment.getContent());
            commentVO.setUserId(comment.getUserId());
            commentVO.setPostId(comment.getPostId());
            commentVO.setParentId(comment.getParentId());
            commentVO.setCreateTime(comment.getCreateTime());
            commentVO.setReplies(new ArrayList<>());

            // 获取用户信息
            User user = userMapper.selectById(comment.getUserId());
            if (user != null) {
                commentVO.setUsername(user.getUsername());
                commentVO.setNickname(user.getNickname());
                commentVO.setAvatar(user.getAvatar());
            }

            commentMap.put(comment.getId(), commentVO);
        }

        // 构建评论树
        for (Comment comment : comments) {
            CommentVO commentVO = commentMap.get(comment.getId());
            if (comment.getParentId() == null) {
                // 顶级评论
                topComments.add(commentVO);
            } else {
                // 回复评论
                CommentVO parentVO = commentMap.get(comment.getParentId());
                if (parentVO != null) {
                    parentVO.getReplies().add(commentVO);
                }
            }
        }

        return topComments;
    }

    @Override
    @Transactional
    public void replyComment(Comment comment) {
        // 保存回复
        baseMapper.insert(comment);
        // 更新帖子评论数
        Post post = postMapper.selectById(comment.getPostId());
        if (post != null) {
            post.setComments(post.getComments() + 1);
            postMapper.updateById(post);
        }
    }

    @Override
    @Transactional
    public void deleteComment(String commentId) {
        // 获取评论信息
        Comment comment = baseMapper.selectById(commentId);
        if (comment != null) {
            // 删除评论
            baseMapper.deleteById(commentId);
            // 更新帖子评论数
            Post post = postMapper.selectById(comment.getPostId());
            if (post != null && post.getComments() > 0) {
                post.setComments(post.getComments() - 1);
                postMapper.updateById(post);
            }
        }
    }

}
