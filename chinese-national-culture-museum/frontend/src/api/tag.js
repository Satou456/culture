import request from './request';

export const tagApi = {
  // 获取标签列表
  getTags() {
    return request.get('/tags');
  },
  
  // 按标签获取帖子
  getPostsByTag(tagName, params) {
    return request.get(`/tags/${tagName}/posts`, { params });
  }
};
