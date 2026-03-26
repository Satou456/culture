import axios from 'axios';

// 缓存配置
const cacheConfig = {
  maxAge: 5 * 60 * 1000, // 缓存过期时间：5分钟
  enabled: true, // 是否启用缓存
};

// 缓存存储
const cache = {
  get(key) {
    if (!cacheConfig.enabled) return null;
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      // 检查缓存是否过期
      if (now - parsed.timestamp > cacheConfig.maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  set(key, data) {
    if (!cacheConfig.enabled) return;
    try {
      const item = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },
  remove(key) {
    if (!cacheConfig.enabled) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }
};

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://20.196.138.17:8080', // 从环境变量获取 API 基础 URL
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器：自动添加 token 和缓存检查
request.interceptors.request.use(config => {
  // 自动添加 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }

  // 检查缓存（仅对 GET 请求）
  if (config.method === 'get') {
    const cacheKey = `api_cache_${config.url}_${JSON.stringify(config.params || {})}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      // 如果有缓存，直接返回缓存数据，取消请求
      return Promise.reject({ cachedData, config });
    }
  }

  return config;
});

// 响应拦截器：统一处理 code 非 1 的错误和缓存
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 1) {
      // 构造错误对象，包含错误信息和状态码
      const error = new Error(res.msg || '请求失败');
      error.code = res.code;
      return Promise.reject(error);
    }

    // 缓存 GET 请求的响应
    if (response.config.method === 'get') {
      const cacheKey = `api_cache_${response.config.url}_${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, res.data);
    }

    return res.data; // 直接返回 data 部分，方便使用
  },
  error => {
    // 处理缓存数据
    if (error.cachedData) {
      return Promise.resolve(error.cachedData);
    }

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