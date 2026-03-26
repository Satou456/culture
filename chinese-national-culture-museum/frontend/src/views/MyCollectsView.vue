<template>
  <div class="my-collects-page">
    <h2 class="page-title">我的收藏</h2>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchMyCollects" class="retry-btn">重试</button>
    </div>

    <div v-else-if="collects.length === 0" class="status-message">
      <p>暂无收藏</p>
      <router-link to="/" class="create-btn">去浏览作品</router-link>
    </div>

    <div v-else class="post-list">
      <article v-for="collect in collects" :key="collect.id" class="post-card" @click="navigateToPost(collect.id)">
        <!-- 图片展示区域 -->
        <div v-if="collect.fileUrl" class="post-image-container">
          <img :src="collect.fileUrl" class="post-image" alt="Post image" />
        </div>

        <!-- 内容区域 -->
        <div class="post-content">
          <h3 class="post-title">{{ collect.title }}</h3>
          <p class="post-summary" v-if="!collect.fileUrl">{{ collect.content }}</p>
        </div>

        <!-- 底部信息 -->
        <div class="post-footer">
          <div class="author-info">
            <img :src="collect.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collect.authorName || collect.authorUsername}`" class="author-avatar" />
            <span class="author-name">{{ collect.authorName || collect.authorUsername }}</span>
          </div>
          <div class="post-stats">
            <span class="stat-item">
              <span class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span class="stat-value">{{ collect.comments }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </span>
              <span class="stat-value">{{ collect.likeCount }}</span>
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collectApi } from '@/api/collect';
import { errorHandler } from '@/utils/errorHandler';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const collects = ref([]);

// 跳转到作品详情页面
const navigateToPost = (postId) => {
  router.push(`/post/${postId}`);
};

// 获取我的收藏列表
const fetchMyCollects = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await collectApi.getMyCollects({ page: 1, size: 20 });
    collects.value = data;
  } catch (err) {
    error.value = err.message || '加载失败，请检查网络连接';
    errorHandler.handleApiError(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMyCollects();
});
</script>

<style scoped>
.my-collects-page {
  width: 100%;
  height: 100%;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 700;
}

.loading-container,
.error-container,
.status-message {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #d9534f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn,
.create-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #d9534f, #c9302c);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.retry-btn:hover,
.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 83, 79, 0.3);
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.post-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.post-image-container {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.post-content {
  padding: 12px 12px 8px;
}

.post-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-title:hover {
  color: #d9534f;
}

.post-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-footer {
  padding: 8px 12px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.post-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.stat-icon {
  display: flex;
  align-items: center;
}

.stat-value {
  font-size: 11px;
}
</style>
