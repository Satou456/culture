package satou.community.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "创建文章参数")
public class PostCreateDTO {
    @Schema(description = "文章标题")
    private String title;
    @Schema(description = "文章内容")
    private String content;
    @Schema(description = "文件URL")
    private String fileUrl;
    @Schema(description = "所属民族")
    private String ethnicGroup;
    @Schema(description = "所属地区")
    private String region;
    @Schema(description = "可见性")
    private Integer visibility;   // 1-公开，2-仅好友
    @Schema(description = "标签名称列表")
    private List<String> tagNames;
}