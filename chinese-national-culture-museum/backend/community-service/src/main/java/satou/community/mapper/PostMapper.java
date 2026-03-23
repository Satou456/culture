package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import satou.community.domain.entity.Post;
import satou.community.domain.vo.PostDetailVO;

import java.util.List;

public interface PostMapper extends BaseMapper<Post> {

    PostDetailVO selectDetailVO(@Param("postId") String postId);

    /**
     * 分页查询作品列表（支持按用户ID过滤，支持可见性过滤，支持排序）
     * 注意：实际项目中建议使用 XML 配置动态 SQL，这里为简化演示使用注解逻辑示意
     * 具体实现建议在 PostMapper.xml 中编写动态 SQL 处理 visibility 和 friend 逻辑
     */
    List<PostDetailVO> selectPostList(@Param("currentUserId") String currentUserId, 
                                      @Param("targetUserId") String targetUserId, 
                                      @Param("offset") int offset, 
                                      @Param("limit") int limit,
                                      @Param("sortType") String sortType);
}