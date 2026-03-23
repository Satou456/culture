import request from './request';

export const statsApi = {
  // 获取论坛统计数据
  getStats() {
    return request.get('/stats');
  }
};
