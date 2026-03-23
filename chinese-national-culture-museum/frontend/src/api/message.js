import request from './request';

export const messageApi = {
  // 发送私信
  sendMessage(data) {
    return request.post('/message/send', data);
  },
  // 获取最近聊天列表
  getRecentList(page = 1, size = 20) {
    return request.get('/message/recent', { params: { page, size } });
  },
  // 获取与某好友的聊天记录
  getConversation(friendUsername, page = 1, size = 20) {
    return request.get('/message/conversation', { params: { friendUsername, page, size } });
  }
};