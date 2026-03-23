package satou.community.service;

public interface LikeService {
  /**
   * 点赞作品
   * 
   * @param postId 作品ID
   */
  void likePost(String postId);

  /**
   * 取消点赞
   * 
   * @param postId 作品ID
   */
  void unlikePost(String postId);

  /**
   * 检查是否已点赞
   * 
   * @param postId 作品ID
   * @return true-已点赞，false-未点赞
   */
  boolean isLiked(String postId);
}
