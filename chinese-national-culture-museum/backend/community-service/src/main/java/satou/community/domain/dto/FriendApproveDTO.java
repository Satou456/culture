package satou.community.domain.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class FriendApproveDTO {
    
    @NotNull(message = "好友申请ID不能为空")
    private Integer friendApproveId;
    
    /**
     * 1-同意 0-拒绝
     */
    @NotNull(message = "操作类型不能为空")
    private Integer type;
}