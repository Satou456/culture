package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import satou.community.domain.entity.Interaction;
import satou.community.domain.vo.PostDetailVO;

import java.util.List;

public interface InteractionMapper extends BaseMapper<Interaction> {

    /**
     * 获取用户收藏的作品列表
     * 
     * @param userId 用户ID
     * @param offset 偏移量
     * @param limit  限制数量
     * @return 收藏的作品列表
     */
    List<PostDetailVO> selectCollectedPosts(@Param("userId") String userId, @Param("offset") int offset,
            @Param("limit") int limit);
}
