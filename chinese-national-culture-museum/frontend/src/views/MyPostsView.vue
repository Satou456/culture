<template>
  <div class="my-posts-page">
    <h2 class="page-title">我的帖子</h2>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchMyPosts" class="retry-btn">重试</button>
    </div>

    <div v-else-if="posts.length === 0" class="status-message">
      <p>暂无帖子</p>
      <router-link to="/create-post" class="create-btn">+ 发布新帖子</router-link>
    </div>

    <div v-else class="post-list">
      <article v-for="post in posts" :key="post.id" class="post-card" @click="navigateToPost(post.id)">
        <!-- 图片展示区域 -->
        <div v-if="post.fileUrl" class="post-image-container">
          <img :src="post.fileUrl" class="post-image" alt="Post image" />
        </div>

        <!-- 内容区域 -->
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-summary" v-if="!post.fileUrl">{{ post.content }}</p>
        </div>

        <!-- 底部信息 -->
        <div class="post-footer">
          <div class="author-info">
            <img :src="post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`" class="author-avatar" />
            <span class="author-name">{{ post.authorName }}</span>
          </div>
          <div class="post-stats">
            <span class="stat-item">
              <span class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span class="stat-value">{{ post.comments }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </span>
              <span class="stat-value">{{ post.likeCount }}</span>
            </span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="post-actions">
          <button @click.stop="editPost(post.id)" class="action-btn edit-btn">修改</button>
          <button @click.stop="deletePost(post.id)" class="action-btn delete-btn">删除</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { postApi } from '@/api/post';
import { errorHandler } from '@/utils/errorHandler';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const posts = ref([]);

// 跳转到作品详情页面
const navigateToPost = (postId) => {
  router.push(`/post/${postId}`);
};

// 跳转到编辑页面
const editPost = (postId) => {
  router.push(`/edit-post/${postId}`);
};

// 获取我的帖子
const fetchMyPosts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await postApi.getMyPosts();
    posts.value = response;
  } catch (err) {
    errorHandler.handleApiError(err);
    error.value = '获取帖子失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 删除帖子
const deletePost = async (postId) => {
  if (confirm('确定要删除这篇帖子吗？')) {
    try {
      await postApi.deletePost(postId);
      // 重新获取帖子列表
      fetchMyPosts();
    } catch (err) {
      errorHandler.handleApiError(err);
    }
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchMyPosts();
});

// 每次激活组件时重新获取数据
onActivated(() => {
  fetchMyPosts();
});
</script>

<style scoped>
.my-posts-page {
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
  padding: 8px 12px;
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

.post-actions {
  padding: 0 12px 12px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(217, 83, 79, 0.1);
  color: #d9534f;
}

.edit-btn:hover {
  background: rgba(217, 83, 79, 0.2);
}

.delete-btn {
  background: #f8f9fa;
  color: #666;
}

.delete-btn:hover {
  background: #e9ecef;
  color: #d9534f;
}
</style>
