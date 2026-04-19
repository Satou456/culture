package satou.community.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import satou.community.domain.dto.PostCreateDTO;
import satou.community.domain.entity.*;
import satou.community.domain.vo.PostDetailVO;
import satou.community.exception.BusinessException;
import satou.community.mapper.*;
import satou.community.service.PostService;
import satou.community.utils.BeanCopyUtils;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {
    private final TagMapper tagMapper;
    private final PostTagMapper postTagMapper;
    private final FriendMapper friendMapper;
    private final UserMapper userMapper;
    private final PostMapper postMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createPost(PostCreateDTO dto) {
        String currentUserId = StpUtil.getLoginIdAsString();
        User user = userMapper.selectById(currentUserId);

        // 1. 构建 Post 实体
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .fileUrl(dto.getFileUrl())
                .userId(currentUserId)
                .ethnicGroup(user.getEthnicGroup())
                .region(user.getProvince() + user.getCity())
                .visibility(dto.getVisibility())
                .likeCount(0)
                .comments(0)
                .collects(0)
                .top(false)
                .build();

        this.save(post);

        // 2. 处理标签
        if (dto.getTagNames() != null && !dto.getTagNames().isEmpty()) {
            List<PostTag> postTags = new ArrayList<>();
            for (String tagName : dto.getTagNames()) {
                // 查找标签，不存在则创建
                Tags tags = tagMapper.selectOne(new LambdaQueryWrapper<Tags>().eq(Tags::getName, tagName));
                if (tags == null) {
                    tags = Tags.builder()
                            .name(tagName)
                            .topicCount(1)
                            .build();
                    tagMapper.insert(tags);
                } else {
                    // 存在则计数 +1 (可选，也可通过 count(*) 实时查)
                    tags.setTopicCount(tags.getTopicCount() + 1);
                    tagMapper.updateById(tags);
                }

                postTags.add(PostTag.builder()
                        .tagId(tags.getId())
                        .postId(post.getId())
                        .build());
            }
            // 批量插入关联表
            if (!postTags.isEmpty()) {
                for (PostTag pt : postTags) {
                    postTagMapper.insert(pt);
                }
            }
        }
    }

    @Override
    public PostDetailVO getPostDetail(String postId) {
        PostDetailVO vo = baseMapper.selectDetailVO(postId);
        if (vo == null) {
            throw new BusinessException("作品不存在");
        }

        // 权限校验：如果不是公开，且不是本人，且不是好友，则不可见
        if (vo.getVisibility() == 2) { // 2 = 仅好友
            String currentUserId = StpUtil.isLogin() ? StpUtil.getLoginIdAsString() : null;
            boolean isOwner = vo.getUserId().equals(currentUserId);
            boolean isFriend = false;

            if (!isOwner && currentUserId != null) {
                // 检查是否是好友
                Long count = friendMapper.selectCount(new LambdaQueryWrapper<Friend>()
                        .eq(Friend::getUserId, currentUserId)
                        .eq(Friend::getFriendId, vo.getUserId()));
                isFriend = count > 0;
            }

            if (!isOwner && !isFriend) {
                throw new BusinessException("无权查看该作品（仅好友可见）");
            }
        }

        if (vo.getTags() == null) {
            vo.setTags(new ArrayList<>());
        }

        return vo;
    }

    @Override
    public List<PostDetailVO> listPosts(String targetUserId, int page, int size, String sortType) {
        String currentUserId = StpUtil.isLogin() ? StpUtil.getLoginIdAsString() : null;
        int offset = (page - 1) * size;

        List<PostDetailVO> list = baseMapper.selectPostList(currentUserId, targetUserId, offset, size, sortType);

        for (PostDetailVO vo : list) {
            if (vo.getTags() == null) {
                vo.setTags(new ArrayList<>());
            }
        }

        return list;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deletePost(String postId) {
        String currentUserId = StpUtil.getLoginIdAsString();

        Post post = this.getById(postId);

        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        if (!post.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权删除他人作品");
        }

        // 删除关联的 PostTag
        postTagMapper.delete(new LambdaQueryWrapper<PostTag>().eq(PostTag::getPostId, postId));

        // 删除作品
        this.removeById(postId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePost(String postId, PostCreateDTO dto) {
        String currentUserId = StpUtil.getLoginIdAsString();
        User user = userMapper.selectById(currentUserId);

        Post post = this.getById(postId);

        if (post == null) {
            throw new BusinessException("作品不存在");
        }

        if (!post.getUserId().equals(currentUserId)) {
            throw new BusinessException("无权修改他人作品");
        }

        // 更新作品基本信息
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setFileUrl(dto.getFileUrl());
        post.setEthnicGroup(user.getEthnicGroup());
        post.setRegion(user.getProvince() + user.getCity());
        post.setVisibility(dto.getVisibility());

        this.updateById(post);

        // 删除旧的标签关联
        postTagMapper.delete(new LambdaQueryWrapper<PostTag>().eq(PostTag::getPostId, postId));

        // 重新处理标签
        if (dto.getTagNames() != null && !dto.getTagNames().isEmpty()) {
            List<PostTag> postTags = new ArrayList<>();
            for (String tagName : dto.getTagNames()) {
                // 查找标签，不存在则创建
                Tags tags = tagMapper.selectOne(new LambdaQueryWrapper<Tags>().eq(Tags::getName, tagName));
                if (tags == null) {
                    tags = Tags.builder()
                            .name(tagName)
                            .topicCount(1)
                            .build();
                    tagMapper.insert(tags);
                } else {
                    // 存在则计数 +1
                    tags.setTopicCount(tags.getTopicCount() + 1);
                    tagMapper.updateById(tags);
                }

                postTags.add(PostTag.builder()
                        .tagId(tags.getId())
                        .postId(postId)
                        .build());
            }
            // 批量插入关联表
            if (!postTags.isEmpty()) {
                for (PostTag pt : postTags) {
                    postTagMapper.insert(pt);
                }
            }
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<PostDetailVO> recommendPost() {
        return recommendPosts();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<PostDetailVO> recommendPosts() {
        String currentUserId = StpUtil.getLoginIdAsString();
        User user = userMapper.selectById(currentUserId);
        List<PostDetailVO> posts = postMapper.selectAllPost();
        List<PostDetailVO> posts1 = posts.stream().filter(post -> post.getEthnicGroup().equals(user.getEthnicGroup())).toList();
        List<PostDetailVO> posts2 = posts.stream().filter(
                post -> post.getRegion().equals(user.getProvince() + user.getCity())).toList();

        List<String> userInterestTags = user.getInterestTags();
        List<PostDetailVO> posts3 = postMapper.selectByTags(userInterestTags.get(0));

        List<PostDetailVO> mergedList = Stream.of(posts1, posts2, posts3)
                .flatMap(List::stream)
                // 核心代码：根据 ID 去重
                .filter(distinctByKey(PostDetailVO::getId))
                .toList();

        return mergedList;
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }

}