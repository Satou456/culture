package satou.community.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import satou.community.domain.dto.ProfileDTO;
import satou.community.domain.entity.User;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    int updateProfile(@Param("userId") String userId, @Param("dto") ProfileDTO dto);
}
