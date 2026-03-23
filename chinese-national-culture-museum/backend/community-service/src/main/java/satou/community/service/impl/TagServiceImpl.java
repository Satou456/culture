package satou.community.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import satou.community.domain.entity.Tags;
import satou.community.domain.vo.PostDetailVO;
import satou.community.mapper.TagMapper;
import satou.community.service.TagService;

import java.util.List;

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

}
