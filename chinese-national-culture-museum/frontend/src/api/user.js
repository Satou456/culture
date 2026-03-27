import request from './request';

export const userApi = {
  login(username, password) {
    return request.post('/user/login', { username, password });
  },
  register(username, email, password, checkPass) {
    return request.post('/user/register', { username, email, password, checkPass });
  },
  logout() {
    return request.post('/user/logout');
  },
  getUserInfo(id) {
    return request.get(`/user/${id}`);
  },
  updateUserInfo(profileData) {
    return request.put('/user/update', profileData).then(res => {
      // 清除用户相关缓存
      request.clearCache('/user');
      return res;
    });
  },
  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload?type=avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      // 清除用户相关缓存
      request.clearCache('/user');
      return res;
    });
  },
  uploadBanner(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/upload?type=banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      // 清除用户相关缓存
      request.clearCache('/user');
      return res;
    });
  },
  changePassword(passwordForm) {
    return request.post('/user/change-password', passwordForm);
  },
  changeSecurityQuestion(securityForm) {
    return request.post('/user/change-security-question', securityForm);
  },
  // 搜索用户
  searchUsers(username) {
    return request.get('/user/search', { params: { username } });
  }
};
