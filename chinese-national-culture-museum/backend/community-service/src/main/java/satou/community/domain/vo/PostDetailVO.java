package satou.community.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "作品详情")
public class PostDetailVO {
    @Schema(description = "作品ID")
    private String id;
    @Schema(description = "作品标题")
    private String title;
    @Schema(description = "作品内容")
    private String content;
    @Schema(description = "封面图或视频URL")
    private String fileUrl;
    @Schema(description = "作者ID")
    private String userId;
    @Schema(description = "作者用户名")
    private String authorUsername;
    @Schema(description = "作者昵称")
    private String authorName;
    @Schema(description = "作者头像")
    private String authorAvatar;
    @Schema(description = "民族")
    private String ethnicGroup;
    @Schema(description = "地区")
    private String region;
    @Schema(description = "可见性")
    private Integer visibility;
    @Schema(description = "评论数")
    private Integer comments;
    @Schema(description = "收藏数")
    private Integer collects;
    @Schema(description = "点赞数")
    private Integer likeCount;
    @Schema(description = "是否置顶")
    private Boolean top;
    @Schema(description = "创建时间")
    private String createTime;
    @Schema(description = "标签名称列表")
    private List<String> tags;
}