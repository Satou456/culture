package satou.community.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import satou.community.domain.entity.Post;
import satou.community.domain.vo.StatsVO;
import satou.community.mapper.CommentMapper;
import satou.community.mapper.PostMapper;
import satou.community.mapper.UserMapper;
import satou.community.service.StatsService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;

    @Override
    public StatsVO getStats() {
        StatsVO stats = new StatsVO();
        
        // 获取总用户数
        Long totalUsers = userMapper.selectCount(null);
        stats.setTotalUsers(totalUsers);
        
        // 获取总话题数（帖子数）
        Long totalPosts = postMapper.selectCount(null);
        stats.setTotalPosts(totalPosts);
        
        // 获取总回复数（评论数）
        Long totalComments = commentMapper.selectCount(null);
        stats.setTotalComments(totalComments);
        
        // 获取今日新增（今日新增的帖子数）
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LambdaQueryWrapper<Post> todayQuery = new LambdaQueryWrapper<Post>()
                .ge(Post::getCreateTime, todayStart);
        Long todayNew = postMapper.selectCount(todayQuery);
        stats.setTodayNew(todayNew);
        
        log.info("获取论坛统计数据：总用户数={}, 总话题数={}, 总回复数={}, 今日新增={}", 
                totalUsers, totalPosts, totalComments, todayNew);
        
        return stats;
    }
}
