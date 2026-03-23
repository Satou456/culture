package satou.community.service;

import com.baomidou.mybatisplus.extension.service.IService;
import satou.community.domain.dto.PostCreateDTO;
import satou.community.domain.vo.PostDetailVO;
import satou.community.domain.entity.Post;

import java.util.List;

public interface PostService extends IService<Post> {

    void createPost(PostCreateDTO dto);

    PostDetailVO getPostDetail(String postId);

    List<PostDetailVO> listPosts(String targetUserId, int page, int size, String sortType);

    void deletePost(String postId);

    void updatePost(String postId, PostCreateDTO dto);
}
