package satou.community.service;

import satou.community.domain.vo.StatsVO;

public interface StatsService {

    /**
     * 获取论坛统计数据
     * @return 统计数据
     */
    StatsVO getStats();
}
