import request from './request';

export const likeApi = {
  // 点赞作品
  likePost(postId) {
    return request.post(`/likes/post/${postId}`);
  },
  
  // 取消点赞
  unlikePost(postId) {
    return request.delete(`/likes/post/${postId}`);
  },
  
  // 检查点赞状态
  checkLikeStatus(postId) {
    return request.get(`/likes/post/${postId}/status`);
  }
};
