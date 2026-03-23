import request from './request';

export const friendApi = {
  // 获取好友申请列表
  getRequests() {
    return request.get('/friend/request');
  },
  // 获取好友列表
  getFriends(userId) {
    return request.get('/friend/list', { params: { userId } });
  },
  // 处理好友请求
  approveRequest(data) {
    return request.post('/friend/approve', data);
  },
  // 添加好友
  addFriend(friendUsername) {
    return request.post('/friend/add', null, { params: { friendUsername } });
  },
  // 删除好友
  deleteFriend(friendId) {
    return request.delete('/friend/delete', { params: { friendId } });
  }
};