import request from './request';

export const postApi = {
  // 获取推荐文章列表（首页）
  getRecommendPosts() {
    return request.get('/posts/recommend');
  },

  // 获取文章列表
  getPosts(params) {
    return request.get('/posts', { params });
  },
  // 获取我的文章列表
  getMyPosts() {
    return request.get('/posts/my');
  },
  // 获取指定用户的文章列表
  getUserPosts(userId) {
    return request.get('/posts', { params: { userId } });
  },
  // 创建文章
  createPost(data) {
    return request.post('/posts', data).then(res => {
      // 清除相关缓存
      request.clearCache('/posts');
      return res;
    });
  },
  // 更新文章
  updatePost(id, data) {
    return request.put(`/posts/${id}`, data).then(res => {
      // 清除相关缓存
      request.clearCache('/posts');
      request.clearCache(`/posts/${id}`);
      return res;
    });
  },
  // 删除文章
  deletePost(id) {
    return request.delete('/posts', { params: { id } }).then(res => {
      // 清除相关缓存
      request.clearCache('/posts');
      return res;
    });
  },
  // 获取文章详情
  getPostDetail(id) {
    return request.get(`/posts/${id}`);
  },
  // 获取我的收藏列表
  getMyCollections(params) {
    return request.get('/collects', { params });
  }
};