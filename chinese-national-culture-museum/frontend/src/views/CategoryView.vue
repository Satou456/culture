<template>
  <div class="category-page">
    <h2 class="page-title">分类浏览</h2>

    <div class="category-content">
      <!-- 左侧标签列表 -->
      <div class="tags-sidebar">
        <h3 class="sidebar-title">标签分类</h3>
        <div v-if="loadingTags" class="loading-spinner"></div>
        <div v-else-if="errorTags" class="error-message">
          {{ errorTags }}
          <button @click="fetchTags" class="retry-btn">重试</button>
        </div>
        <div v-else class="tags-list">
          <div
            v-for="tag in tags"
            :key="tag.id"
            @click="selectTag(tag.name)"
            class="tag-item"
            :class="{ active: selectedTag === tag.name }"
          >
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.topicCount }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧帖子列表 -->
      <div class="posts-content">
        <div v-if="!selectedTag" class="welcome-message">
          <h3>选择一个标签开始浏览</h3>
          <p>点击左侧标签查看相关作品</p>
        </div>

        <div v-else>
          <div class="tags-header">
            <h3>标签：{{ selectedTag }}</h3>
            <button @click="clearSelection" class="clear-btn">清除选择</button>
          </div>

          <div v-if="loadingPosts" class="loading-spinner"></div>
          <div v-else-if="errorPosts" class="error-message">
            {{ errorPosts }}
            <button @click="fetchPostsByTag" class="retry-btn">重试</button>
          </div>
          <div v-else-if="posts.length === 0" class="empty-message">
            该标签下暂无作品
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
                  <img :src="post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName || post.authorUsername}`" class="author-avatar" />
                  <span class="author-name">{{ post.authorName || post.authorUsername }}</span>
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
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { tagApi } from '@/api/tag';
import { errorHandler } from '@/utils/errorHandler';

const router = useRouter();

// 标签相关状态
const tags = ref([]);
const loadingTags = ref(false);
const errorTags = ref(null);

// 帖子相关状态
const posts = ref([]);
const loadingPosts = ref(false);
const errorPosts = ref(null);
const selectedTag = ref('');

// 跳转到作品详情页面
const navigateToPost = (postId) => {
  router.push(`/post/${postId}`);
};

// 获取标签列表
const fetchTags = async () => {
  loadingTags.value = true;
  errorTags.value = null;

  try {
    const data = await tagApi.getTags();
    tags.value = data;
    // 默认选择第一个标签
    if (data && data.length > 0) {
      selectedTag.value = data[0].name;
      fetchPostsByTag();
    }
  } catch (err) {
    errorTags.value = '获取标签列表失败';
    errorHandler.handleApiError(err);
  } finally {
    loadingTags.value = false;
  }
};

// 按标签获取帖子
const fetchPostsByTag = async () => {
  if (!selectedTag.value) return;

  loadingPosts.value = true;
  errorPosts.value = null;

  try {
    const data = await tagApi.getPostsByTag(selectedTag.value, { page: 1, size: 20 });
    posts.value = data;
  } catch (err) {
    errorPosts.value = '获取帖子失败';
    errorHandler.handleApiError(err);
  } finally {
    loadingPosts.value = false;
  }
};

// 选择标签
const selectTag = (tagName) => {
  selectedTag.value = tagName;
  fetchPostsByTag();
};

// 清除选择
const clearSelection = () => {
  selectedTag.value = '';
  posts.value = [];
};

// 组件挂载时获取标签列表
onMounted(() => {
  fetchTags();
});
</script>

<style scoped>
.category-page {
  width: 100%;
  height: 100%;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 700;
}

.category-content {
  display: flex;
  gap: 20px;
  height: calc(100% - 60px);
}

.tags-sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid #d9534f;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.sidebar-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #d9534f;
  font-weight: 600;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #d9534f;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tag-item:hover {
  background: rgba(217, 83, 79, 0.1);
  border-color: rgba(217, 83, 79, 0.2);
  transform: translateX(4px);
}

.tag-item.active {
  background: rgba(217, 83, 79, 0.15);
  color: #d9534f;
  border-color: rgba(217, 83, 79, 0.3);
  font-weight: 500;
}

.tag-name {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.tag-count {
  font-size: 12px;
  color: #666;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 24px;
  text-align: center;
}

.posts-content {
  flex: 1;
  overflow-y: auto;
}

.welcome-message {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.welcome-message h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.tags-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.clear-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e9ecef;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #d9534f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 40px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #d9534f, #c9302c);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.empty-message {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
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
