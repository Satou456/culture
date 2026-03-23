package satou.community.service;

import com.baomidou.mybatisplus.extension.service.IService;
import satou.community.domain.entity.Interaction;
import satou.community.domain.vo.PostDetailVO;

import java.util.List;

public interface CollectService extends IService<Interaction> {

    /**
     * 收藏作品
     * @param postId 作品ID
     */
    void collectPost(String postId);

    /**
     * 取消收藏
     * @param postId 作品ID
     */
    void uncollectPost(String postId);

    /**
     * 检查是否已收藏
     * @param postId 作品ID
     * @return 是否已收藏
     */
    boolean isCollected(String postId);

    /**
     * 获取我的收藏列表
     * @param page 页码
     * @param size 每页数量
     * @return 收藏的作品列表
     */
    List<PostDetailVO> getMyCollects(int page, int size);
}
