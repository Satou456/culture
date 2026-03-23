package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import satou.community.domain.entity.Interaction;
import satou.community.domain.entity.Post;
import satou.community.exception.BusinessException;
import satou.community.mapper.InteractionMapper;
import satou.community.mapper.PostMapper;
import satou.community.service.LikeService;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl extends ServiceImpl<InteractionMapper, Interaction> implements LikeService {

    private final PostMapper postMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void likePost(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        // 检查作品是否存在
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        // 检查是否已点赞
        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 1); // 1-点赞

        if (baseMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException("已点赞该作品");
        }

        // 创建点赞记录
        Interaction interaction = Interaction.builder()
                .userId(currentUserId)
                .targetId(postId)
                .targetType(1) // 1-作品
                .actionType(1) // 1-点赞
                .build();

        baseMapper.insert(interaction);

        // 更新作品点赞数
        post.setLikeCount(post.getLikeCount() + 1);
        postMapper.updateById(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void unlikePost(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        // 检查作品是否存在
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        // 检查是否已点赞
        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 1); // 1-点赞

        Interaction interaction = baseMapper.selectOne(queryWrapper);
        if (interaction == null) {
            throw new BusinessException("未点赞该作品");
        }

        // 删除点赞记录
        baseMapper.deleteById(interaction.getId());

        // 更新作品点赞数
        if (post.getLikeCount() > 0) {
            post.setLikeCount(post.getLikeCount() - 1);
            postMapper.updateById(post);
        }
    }

    @Override
    public boolean isLiked(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 1); // 1-点赞

        return baseMapper.selectCount(queryWrapper) > 0;
    }
}
