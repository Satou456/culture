import request from './request';

export const commentApi = {
  // 创建评论
  createComment(comment) {
    return request.post('/comments', comment);
  },
  
  // 获取帖子评论
  getCommentsByPostId(postId) {
    return request.get(`/comments/post/${postId}`);
  },
  
  // 删除评论
  deleteComment(commentId) {
    return request.delete(`/comments/${commentId}`);
  }
};
