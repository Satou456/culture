<template>
  <div class="wrapper" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <form @submit.prevent="handleRegister" class="auth-form">
      <a href="http://20.196.138.17:5000/" class="back-home-link"><i class="fas fa-arrow-left"></i></a>
      <h2>注册</h2>
      <div class="input-field">
        <input v-model="form.username" type="text" placeholder="请输入用户名" required>
      </div>
      <div class="input-field">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required>
      </div>
      <div class="input-field">
        <input v-model="form.password" type="password" placeholder="请输入密码" required>
      </div>
      <div class="input-field">
        <input v-model="form.checkPass" type="password" placeholder="请确认密码" required>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <div class="register">
        <p>已有账号？ <router-link to="/login" class="link">登录</router-link></p>
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
const success = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
  checkPass: '',
});

const handleRegister = async () => {
  if (form.password !== form.checkPass) {
    error.value = '两次输入的密码不一致';
    return;
  }
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    await userApi.register(form.username, form.email, form.password, form.checkPass);
    success.value = '注册成功！即将跳转到登录页...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.message || '注册失败，请稍后重试';
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
  gap: 20px;
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

.error-message {
  color: #e74c3c;
  font-size: 13px;
  text-align: center;
  background: rgba(231, 76, 60, 0.15);
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.success-message {
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