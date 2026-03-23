<template>
  <div class="test-error-container">
    <h1>异常处理测试</h1>
    <div class="test-buttons">
      <button @click="testBusinessError" class="test-button">测试业务异常</button>
      <button @click="testNetworkError" class="test-button">测试网络错误</button>
      <button @click="testServerError" class="test-button">测试服务器错误</button>
    </div>
    <div class="test-result" v-if="result">
      <h2>测试结果</h2>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script>
import request from '../api/request';
import { errorHandler } from '../utils/errorHandler';

export default {
  name: 'TestErrorView',
  data() {
    return {
      result: ''
    };
  },
  methods: {
    // 测试业务异常
    async testBusinessError() {
      try {
        this.result = '测试业务异常...';
        // 这里模拟一个会返回业务异常的请求
        // 实际项目中替换为真实的API调用
        const response = await request.get('/api/test/business-error');
        this.result = JSON.stringify(response, null, 2);
      } catch (error) {
        this.result = `捕获到错误: ${error.message}`;
        errorHandler.handleApiError(error);
      }
    },
    
    // 测试网络错误
    async testNetworkError() {
      try {
        this.result = '测试网络错误...';
        // 这里模拟一个不存在的API地址，会触发网络错误
        const response = await request.get('/api/nonexistent-endpoint');
        this.result = JSON.stringify(response, null, 2);
      } catch (error) {
        this.result = `捕获到错误: ${error.message}`;
        errorHandler.handleApiError(error);
      }
    },
    
    // 测试服务器错误
    async testServerError() {
      try {
        this.result = '测试服务器错误...';
        // 这里模拟一个会导致服务器错误的请求
        // 实际项目中替换为真实的API调用
        const response = await request.get('/api/test/server-error');
        this.result = JSON.stringify(response, null, 2);
      } catch (error) {
        this.result = `捕获到错误: ${error.message}`;
        errorHandler.handleApiError(error);
      }
    }
  }
}
</script>

<style scoped>
.test-error-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.test-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.test-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.test-button:hover {
  background-color: #45a049;
}

.test-result {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.test-result h2 {
  color: #333;
  margin-bottom: 10px;
}

.test-result pre {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>