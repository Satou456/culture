import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:8080', // 根据实际后端地址修改
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器：自动添加 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 响应拦截器：统一处理 code 非 1 的错误
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 1) {
      // 构造错误对象，包含错误信息和状态码
      const error = new Error(res.msg || '请求失败');
      error.code = res.code;
      return Promise.reject(error);
    }
    return res.data; // 直接返回 data 部分，方便使用
  },
  error => {
    // 处理网络错误、超时等情况
    let errorMessage = '网络错误，请稍后重试';
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;
      switch (status) {
        case 401:
          errorMessage = '未登录，请先登录';
          // 可以在这里跳转到登录页面
          break;
        case 403:
          errorMessage = '无权限访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = '请求失败';
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '服务器无响应，请稍后重试';
    }
    console.error('API Error:', errorMessage, error);
    // 构造错误对象，包含错误信息
    const err = new Error(errorMessage);
    err.originalError = error;
    return Promise.reject(err);
  }
);

export default request;