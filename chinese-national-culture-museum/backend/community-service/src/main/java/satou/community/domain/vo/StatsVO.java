package satou.community.domain.vo;

import lombok.Data;

@Data
public class StatsVO {
    
    private Long totalUsers;
    
    private Long totalPosts;
    
    private Long totalComments;
    
    private Long todayNew;
}
