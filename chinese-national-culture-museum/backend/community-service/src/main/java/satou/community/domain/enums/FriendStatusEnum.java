// FriendStatusEnum.java
package satou.community.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FriendStatusEnum {
    
    PENDING(0, "待同意"),
    ACCEPTED(1, "已同意"),
    REJECTED(2, "已拒绝");
    
    private final Integer code;
    private final String desc;
}