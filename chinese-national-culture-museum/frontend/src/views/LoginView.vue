<template>
  <div class="wrapper" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <form @submit.prevent="handleLogin" class="auth-form">
      <a href="http://127.0.0.1:5000/" class="back-home-link"><i class="fas fa-arrow-left"></i></a>
      <h2>登录</h2>
      <div class="input-field">
        <input v-model="form.username" type="text" placeholder="请输入用户名或邮箱" required>
      </div>
      <div class="input-field">
        <input v-model="form.password" type="password" placeholder="请输入密码" required>
      </div>
      <div class="forget">
        <label for="remember">
          <input type="checkbox" id="remember" v-model="form.remember">
          <span>记住密码</span>
        </label>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <div class="register">
        <p>没有账号？ <router-link to="/register" class="link">注册</router-link></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '@/api/user';
import backgroundImage from '@/assets/background.jpg';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  username: '',
  password: '',
  remember: false
});

// 组件初始化时，从本地存储中读取记住的用户名和密码
console.log('Initializing login form...');
console.log('localStorage rememberMe:', localStorage.getItem('rememberMe'));
console.log('localStorage username:', localStorage.getItem('username'));
console.log('localStorage password:', localStorage.getItem('password'));

if (localStorage.getItem('rememberMe')) {
  form.username = localStorage.getItem('username') || '';
  form.password = localStorage.getItem('password') || '';
  form.remember = true;
  console.log('Form initialized with saved data:', form);
}

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await userApi.login(form.username, form.password);
    if (res) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.id);
      localStorage.setItem('username', res.username);
      
      // 处理记住密码功能
      console.log('Handling remember me...');
      console.log('form.remember:', form.remember);
      console.log('form.username:', form.username);
      console.log('form.password:', form.password);
      
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', form.username);
        localStorage.setItem('password', form.password);
        console.log('Saved to localStorage:', {
          rememberMe: localStorage.getItem('rememberMe'),
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        });
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        console.log('Removed from localStorage');
      }
      
      router.push('/');
    }
  } catch (err) {
    error.value = err.message || '登录失败，请检查用户名和密码';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.7);
}

.auth-form {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.6s ease-out;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-form h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 300;
  color: #333;
  text-align: center;
  letter-spacing: 2px;
}

.input-field {
  position: relative;
  margin-bottom: 10px;
}

.input-field input {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  background: transparent;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  outline: none;
}

.input-field input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}

.input-field input:focus {
  border-bottom-color: #e74c3c;
}

.forget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}

.forget label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.forget input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #e74c3c;
}

.forget a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 500;
}

.forget a:hover {
  color: #c0392b;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  background: rgba(231, 76, 60, 0.15);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.submit-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
  background: #c0392b;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register {
  text-align: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
}

.register .link {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
}

.register .link:hover {
  color: #c0392b;
  text-decoration: underline;
}

.back-home-link {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-home-link i {
  color: #e74c3c;
  font-size: 16px;
  transition: all 0.3s ease;
}

.back-home-link:hover {
  background: #e74c3c;
  border-color: #e74c3c;
  transform: scale(1.1);
}

.back-home-link:hover i {
  color: #fff;
}
</style>