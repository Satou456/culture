import request from './request';

export const collectApi = {
  // 收藏作品
  collectPost(postId) {
    return request.post(`/collects/post/${postId}`).then(res => {
      // 清除相关缓存
      request.clearCache('/collects');
      return res;
    });
  },
  
  // 取消收藏
  uncollectPost(postId) {
    return request.delete(`/collects/post/${postId}`).then(res => {
      // 清除相关缓存
      request.clearCache('/collects');
      return res;
    });
  },
  
  // 检查收藏状态
  checkCollectStatus(postId) {
    return request.get(`/collects/post/${postId}/status`);
  },
  
  // 获取我的收藏列表
  getMyCollects(params) {
    return request.get('/collects', { params });
  }
};
