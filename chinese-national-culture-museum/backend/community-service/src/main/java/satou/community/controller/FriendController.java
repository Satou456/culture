// FriendController.java
package satou.community.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import satou.community.domain.dto.FriendApproveDTO;
import satou.community.domain.result.Result;
import satou.community.domain.vo.FriendVO;
import satou.community.service.FriendService;

import java.util.List;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
@Tag(name = "好友接口", description = "添加好友，处理好友请求，获取好友列表，获取好友申请列表，删除好友")
public class FriendController {
    
    private final FriendService friendService;
    
    /**
     * 添加好友
     */
    @PostMapping("/add")
    @Operation(summary = "添加好友", description = "添加好友接口")
    @Parameter(name = "friendUsername", description = "好友用户名", in = ParameterIn.QUERY)
    public Result<Void> addFriend(@RequestParam("friendUsername") String friendUsername) {
        friendService.addFriend(friendUsername);
        return Result.success();
    }
    
    /**
     * 处理好友请求
     */
    @PostMapping("/approve")
    @Operation(summary = "处理好友请求", description = "处理好友请求接口")
    public Result<Void> approveFriend(@Valid @RequestBody FriendApproveDTO dto) {
        friendService.approveFriend(dto);
        if (dto.getType() == 1){
            return Result.success();
        } else {
            return Result.error("已拒绝好友申请");
        }
    }
    
    /**
     * 获取好友列表
     */
    @GetMapping("/list")
    @Operation(summary = "获取好友列表", description = "获取好友列表接口")
    @Parameter(name = "userId", description = "用户id", in = ParameterIn.QUERY)
    public Result<List<FriendVO>> getFriendList(@RequestParam("userId") String userId) {
        List<FriendVO> list = friendService.getFriendList(userId);
        return Result.success(list);
    }
    
    /**
     * 获取好友申请列表
     */
    @GetMapping("/request")
    @Operation(summary = "获取好友申请列表", description = "获取好友申请列表接口")
    public Result<List<FriendVO>> getFriendRequestList() {
        List<FriendVO> list = friendService.getFriendRequestList();
        return Result.success(list);
    }
    
    /**
     * 删除好友
     */
    @DeleteMapping("/delete")
    @Operation(summary = "删除好友", description = "删除好友接口")
    @Parameter(name = "friendId", description = "好友id", in = ParameterIn.QUERY)
    public Result<Void> deleteFriend(@RequestParam("friendId") String friendId) {
        friendService.deleteFriend(friendId);
        return Result.success();
    }
}