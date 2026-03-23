package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import satou.community.domain.entity.Tags;
import satou.community.domain.vo.PostDetailVO;

import java.util.List;

@Mapper
public interface TagMapper extends BaseMapper<Tags> {

    /**
     * 按标签获取帖子列表
     * @param tagName 标签名称
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 帖子列表
     */
    List<PostDetailVO> selectPostsByTag(@Param("tagName") String tagName, @Param("offset") int offset, @Param("limit") int limit);

}
