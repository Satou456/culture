import request from './request';
import axios from 'axios';

export const uploadApi = {
  // 上传文件（头像）
  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');
    return request.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // 上传文件（作品图片/视频）
  uploadPostFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'post');
    // 使用环境变量或默认的API基础URL
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://20.196.138.17:8080';
    // 直接使用axios，绕过响应拦截器，因为后端可能直接返回文件URL
    return axios.post(`${baseURL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')
      }
    }).then(response => {
      // 检查响应数据类型
      if (typeof response.data === 'string') {
        // 直接返回字符串URL
        return response.data;
      } else if (response.data.code === 1) {
        // 按正常格式返回
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '上传失败');
      }
    });
  }
};