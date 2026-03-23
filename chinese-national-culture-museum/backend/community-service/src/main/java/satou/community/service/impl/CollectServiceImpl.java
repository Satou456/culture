package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import satou.community.domain.entity.Interaction;
import satou.community.domain.entity.Post;
import satou.community.domain.vo.PostDetailVO;
import satou.community.exception.BusinessException;
import satou.community.mapper.InteractionMapper;
import satou.community.mapper.PostMapper;
import satou.community.service.CollectService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectServiceImpl extends ServiceImpl<InteractionMapper, Interaction> implements CollectService {

    private final PostMapper postMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void collectPost(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        // 检查作品是否存在
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        // 检查是否已收藏
        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 2); // 2-收藏

        if (baseMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException("已收藏该作品");
        }

        // 创建收藏记录
        Interaction interaction = Interaction.builder()
                .userId(currentUserId)
                .targetId(postId)
                .targetType(1) // 1-作品
                .actionType(2) // 2-收藏
                .build();

        baseMapper.insert(interaction);

        // 更新作品收藏数
        post.setCollects(post.getCollects() + 1);
        postMapper.updateById(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void uncollectPost(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        // 检查作品是否存在
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        // 检查是否已收藏
        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 2); // 2-收藏

        Interaction interaction = baseMapper.selectOne(queryWrapper);
        if (interaction == null) {
            throw new BusinessException("未收藏该作品");
        }

        // 删除收藏记录
        baseMapper.deleteById(interaction.getId());

        // 更新作品收藏数
        if (post.getCollects() > 0) {
            post.setCollects(post.getCollects() - 1);
            postMapper.updateById(post);
        }
    }

    @Override
    public boolean isCollected(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        LambdaQueryWrapper<Interaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Interaction::getUserId, currentUserId)
                .eq(Interaction::getTargetId, postId)
                .eq(Interaction::getTargetType, 1) // 1-作品
                .eq(Interaction::getActionType, 2); // 2-收藏

        return baseMapper.selectCount(queryWrapper) > 0;
    }

    @Override
    public List<PostDetailVO> getMyCollects(int page, int size) {
        String currentUserId = StpUtil.getLoginIdAsString();
        int offset = (page - 1) * size;

        return baseMapper.selectCollectedPosts(currentUserId, offset, size);
    }
}
