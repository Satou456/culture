package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import satou.community.domain.result.Result;
import satou.community.domain.vo.StatsVO;
import satou.community.service.StatsService;

@Slf4j
@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@Tag(name = "统计接口", description = "论坛统计数据相关接口")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "获取论坛统计数据", description = "获取总用户数、总话题数、总回复数、今日新增等统计数据")
    public Result<StatsVO> getStats() {
        log.info("获取论坛统计数据");
        StatsVO stats = statsService.getStats();
        return Result.success(stats);
    }
}
