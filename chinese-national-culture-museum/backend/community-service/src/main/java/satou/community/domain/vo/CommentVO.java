package satou.community.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentVO {

    private String id;
    private String content;
    private String userId;
    private String username;
    private String nickname;
    private String avatar;
    private String postId;
    private String parentId;
    private LocalDateTime createTime;
    private List<CommentVO> replies;

}
