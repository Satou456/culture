package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import satou.community.domain.entity.Comment;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {

}
