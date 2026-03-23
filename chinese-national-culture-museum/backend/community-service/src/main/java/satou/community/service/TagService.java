package satou.community.service;

import com.baomidou.mybatisplus.extension.service.IService;
import satou.community.domain.entity.Tags;
import satou.community.domain.vo.PostDetailVO;

import java.util.List;

public interface TagService extends IService<Tags> {

    /**
     * 获取标签列表
     * @return 标签列表
     */
    List<Tags> getTags();

    /**
     * 按标签获取帖子
     * @param tagName 标签名称
     * @param page 页码
     * @param size 每页数量
     * @return 帖子列表
     */
    List<PostDetailVO> getPostsByTag(String tagName, int page, int size);

}
