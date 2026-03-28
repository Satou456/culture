<template>
  <div class="home-page">
    <div class="main-card">
      <header class="card-header">
        <div class="header-top">
          <h2 class="page-title">首页</h2>
          <div class="header-actions">
            <div class="filter-tabs">
              <button 
                v-for="tab in tabs" 
                :key="tab.value"
                :class="['tab-btn', { active: currentTab === tab.value }]"
                @click="handleTabChange(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
            <button @click="openCreatePost" class="btn-create-topic">+ 新作品</button>
          </div>
        </div>
      </header>

      <div class="card-body">
        <div v-if="loading" class="status-message">
          <span class="spinner"></span> 正在加载...
        </div>

        <div v-else-if="error" class="status-message error">
          <div class="error-icon-circle">!</div>
          <p>{{ error }}</p>
          <button @click="fetchPosts" class="retry-btn">重试</button>
        </div>

        <div v-else-if="posts.length === 0" class="status-message">
          <p>暂无相关内容</p>
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
          </article>
        </div>
        
        <div v-if="!loading && posts.length > 0 && !noMoreData" class="load-more-container">
          <button @click="loadMore" class="load-more-btn">加载更多</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, inject } from 'vue';
import { useRouter } from 'vue-router';
import { postApi } from '@/api';
import { collectApi } from '@/api/collect';
import { errorHandler } from '@/utils/errorHandler';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const noMoreData = ref(false);
const currentTab = ref('all');
const searchKeyword = ref('');
const posts = ref([]);
const page = ref(1);
const size = 10;
const collectedPosts = ref(new Set());
const collecting = ref(new Set());

// 从父组件MainLayout注入方法
const openCreatePost = inject('openCreatePost', () => {
  //  fallback: 直接打开发布页面
  router.push('/create-post');
});

const tabs = [
  { label: '全部', value: 'all' },
  { label: '最新', value: 'latest' },
  { label: '最热', value: 'hottest' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const fetchPosts = async (isLoadMore = false) => {
  if (loading.value) return;
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page: isLoadMore ? page.value : 1,
      size: size,
      sortType: currentTab.value === 'all' ? 'latest' : currentTab.value
    };
    // 如果有搜索关键词，可以尝试传递，但接口未支持，暂留空
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value; // 后端可能支持，但文档未提及
    }

    const data = await postApi.getPosts(params);
    
    if (isLoadMore) {
      posts.value = [...posts.value, ...data];
      page.value++;
    } else {
      posts.value = data;
      page.value = 2; // 下次加载从第2页开始
    }
    
    // 如果返回数据少于 size，说明没有更多
    if (data.length < size) {
      noMoreData.value = true;
    } else {
      noMoreData.value = false;
    }
  } catch (err) {
    error.value = err.message || '加载失败，请检查网络连接';
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tabValue) => {
  if (currentTab.value === tabValue) return;
  currentTab.value = tabValue;
  posts.value = [];
  noMoreData.value = false;
  page.value = 1;
  fetchPosts();
};

const handleSearch = () => {
  posts.value = [];
  noMoreData.value = false;
  page.value = 1;
  fetchPosts();
};

const loadMore = () => {
  fetchPosts(true);
};

// 跳转到作品详情页面
const navigateToPost = (postId) => {
  router.push(`/post/${postId}`);
};

// 检查帖子的收藏状态
const checkCollectStatus = async (postId) => {
  try {
    const status = await collectApi.checkCollectStatus(postId);
    if (status) {
      collectedPosts.value.add(postId);
    }
  } catch (err) {
    console.error('检查收藏状态失败:', err);
  }
};

// 处理收藏/取消收藏
const handleCollect = async (postId, event) => {
  event.stopPropagation(); // 阻止事件冒泡，避免触发帖子点击
  
  if (collecting.value.has(postId)) return;
  
  collecting.value.add(postId);
  try {
    if (collectedPosts.value.has(postId)) {
      await collectApi.uncollectPost(postId);
      collectedPosts.value.delete(postId);
      // 更新帖子的收藏数
      const post = posts.value.find(p => p.id === postId);
      if (post && post.collects > 0) {
        post.collects--;
      }
    } else {
      await collectApi.collectPost(postId);
      collectedPosts.value.add(postId);
      // 更新帖子的收藏数
      const post = posts.value.find(p => p.id === postId);
      if (post) {
        post.collects++;
      }
    }
  } catch (err) {
    errorHandler.handleApiError(err);
  } finally {
    collecting.value.delete(postId);
  }
};

onMounted(() => {
  fetchPosts();
});

// 每次激活组件时重新获取数据
onActivated(() => {
  // 清除帖子列表缓存，确保获取最新数据
  import('@/api/request').then(({ default: request }) => {
    request.clearCache('/posts');
    fetchPosts();
  });
});
</script>

<style scoped>
.home-page {
  /* 移除背景图设置，背景由父组件 MainLayout 控制 */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main-card {
  /* 卡片样式 */
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
}

.card-header {
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  background: transparent;
  margin-bottom: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-create-topic {
  background: linear-gradient(135deg, #d9534f, #c9302c);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(217, 83, 79, 0.3);
}

.btn-create-topic:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 83, 79, 0.4);
}



.filter-tabs {
  display: flex;
  gap: 2px;
  background: rgba(0, 0, 0, 0.04);
  padding: 4px;
  border-radius: 20px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 6px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 16px;
  transition: all 0.3s;
}

.tab-btn.active {
  background-color: #fff;
  color: #d9534f;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.card-body {
  padding: 0;
  flex: 1;
}

/* 状态消息样式 */
.status-message {
  text-align: center;
  padding: 80px 20px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

/* 模拟截图中的红色感叹号错误样式 */
.status-message.error {
  color: #555;
}

.error-icon-circle {
  width: 48px;
  height: 48px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 24px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}
.retry-btn:hover {
  background: #e6e6e6;
  color: #333;
}

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #d9534f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  border: none;
  padding: 0;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.post-image-container {
  width: 100%;
  padding-bottom: 100%; /* 1:1 宽高比 */
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
  cursor: pointer;
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
  cursor: pointer;
  transition: color 0.2s;
}

.stat-item:hover {
  color: #d9534f;
}

.stat-icon {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.stat-value {
  font-size: 11px;
}

.load-more-container {
  text-align: center;
  margin-top: 30px;
}

.load-more-btn {
  background: rgba(255,255,255,0.6);
  border: 1px solid #ddd;
  color: #666;
  padding: 10px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  backdrop-filter: blur(4px);
}

.load-more-btn:hover {
  background: #fff;
  border-color: #d9534f;
  color: #d9534f;
  box-shadow: 0 2px 8px rgba(217, 83, 79, 0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .main-card {
    min-height: auto;
    border-radius: 0;
    width: 100%;
  }
  
  .card-header {
    padding: 15px 20px;
  }
  
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-dropdowns {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-tabs {
    width: 100%;
    justify-content: space-around;
  }
  
  .card-body {
    padding: 15px 20px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .post-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

