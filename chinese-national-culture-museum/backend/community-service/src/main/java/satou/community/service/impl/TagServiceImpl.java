package satou.community.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import satou.community.domain.entity.InterestingTags;
import satou.community.domain.entity.Tags;
import satou.community.domain.vo.PostDetailVO;
import satou.community.mapper.TagMapper;
import satou.community.service.TagService;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl extends ServiceImpl<TagMapper, Tags> implements TagService {

    private final TagMapper tagMapper;

    @Override
    public List<Tags> getTags() {
        // 获取所有标签，按topic_count降序排列
        LambdaQueryWrapper<Tags> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(Tags::getTopicCount);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<PostDetailVO> getPostsByTag(String tagName, int page, int size) {
        int offset = (page - 1) * size;
        return tagMapper.selectPostsByTag(tagName, offset, size);
    }

    @Override
    public List<InterestingTags> getInterestingTags() {
        // 获取用户兴趣标签,使用Mybatis-plus实现
        return tagMapper.selectInterestingTags();
    }

    private String extractTagName(Map<String, Object> row) {
        for (String key : Arrays.asList("name", "tag_name", "tag", "label", "value", "interesting_tag")) {
            Object value = row.get(key);
            if (value != null && !String.valueOf(value).isBlank()) {
                return String.valueOf(value);
            }
        }

        for (Object value : row.values()) {
            if (value != null && !String.valueOf(value).isBlank()) {
                return String.valueOf(value);
            }
        }

        return null;
    }

}
