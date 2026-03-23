// FriendVO.java
package satou.community.domain.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FriendVO {

    private Integer id;

    private String friendId;

    private String friendUsername;

    private String friendNickname;

    private String avatar;

    private Integer status;

    private String statusDesc;

    private LocalDateTime createTime;

    private boolean isOnline;
}