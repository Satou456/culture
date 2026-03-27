<template>
  <div class="layout-container" :class="{ 'bg-loaded': isBgLoaded }" :style="{ backgroundImage: isBgLoaded ? `url(${backgroundImage})` : 'none' }">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">加载中...</p>
      </div>
    </div>
    
    <!-- 正常内容 -->
    <template v-else>
      <!-- 顶部导航栏 -->
      <header class="top-nav">
        <div class="top-nav-left">
          <div class="logo-area">
            <h1 class="site-title">中华文化论坛</h1>
          </div>
          <nav class="top-nav-links">
            <router-link to="/" class="top-nav-link" exact-active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>首页</span>
            </router-link>
            <router-link to="/category" class="top-nav-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>分类</span>
            </router-link>
            <router-link to="/my-collects" class="top-nav-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>收藏</span>
            </router-link>
            <router-link to="/my-posts" class="top-nav-link" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>我的帖子</span>
            </router-link>
          </nav>
        </div>
        <div class="top-nav-right">
          <router-link to="/message" class="nav-icon-btn">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </span>
            <span v-if="unreadMessages > 0" class="notification-badge">{{ unreadMessages }}</span>
          </router-link>
          <div class="user-menu-container">
            <button class="nav-icon-btn" @click="toggleUserMenu">
              <img v-if="isLoggedIn" :src="userAvatar" alt="avatar" class="user-avatar-small" />
              <span v-else class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
            </button>
            <!-- 下拉菜单 -->
            <div v-if="isLoggedIn && showUserDropdown" class="user-dropdown">
              <button class="dropdown-item" @click="goToProfile">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>个人主页</span>
              </button>
              <button class="dropdown-item" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 中间内容区 -->
        <main class="content-area">
          <router-view :key="route.fullPath" />
        </main>

        <!-- 右侧面板 -->
        <aside class="right-sidebar">
          <!-- 用户信息卡片 -->
          <div class="user-card">
            <div v-if="isLoggedIn" class="user-profile">
              <img :src="userAvatar" alt="avatar" class="user-avatar-large" />
              <h3 class="user-name-large">{{ nickname || username }}</h3>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ friendCount }}</span>
                  <span class="stat-label">好友</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ postCount }}</span>
                  <span class="stat-label">作品</span>
                </div>
              </div>
              <div class="user-actions">
                <router-link to="/friends" class="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>好友</span>
                </router-link>
                <router-link to="/message" class="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>私信</span>
                </router-link>
                <router-link to="/profile" class="action-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>设置</span>
                </router-link>
              </div>
            </div>
            <div v-else class="login-prompt">
              <h3>登录以参与讨论</h3>
              <p>登录后可以发布帖子、评论和与其他用户互动</p>
              <div class="login-buttons">
                <router-link to="/login" class="btn btn-login">登录</router-link>
                <router-link to="/register" class="btn btn-register">注册</router-link>
              </div>
            </div>
          </div>

          <!-- 统计信息卡片 -->
          <div class="stats-card">
            <h3>论坛统计</h3>
            <div class="stats-list">
              <div class="stat-row">
                <span class="stat-label">总用户数</span>
                <span class="stat-value">{{ stats.totalUsers?.toLocaleString() || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">总话题数</span>
                <span class="stat-value">{{ stats.totalPosts?.toLocaleString() || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">总回复数</span>
                <span class="stat-value">{{ stats.totalComments?.toLocaleString() || 0 }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">今日新增</span>
                <span class="stat-value">{{ stats.todayNew?.toLocaleString() || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- 热门标签卡片 -->
          <div class="tags-card">
            <h3>热门标签</h3>
            <div class="tags-list">
              <span v-for="tag in hotTags" :key="tag" class="tag" @click="goToTag(tag)">{{ tag }}</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- 退出登录提示框 -->
      <div v-if="showLogoutModal" class="logout-modal-overlay" @click="cancelLogout">
        <div class="logout-modal" @click.stop>
          <div class="logout-modal-header">
            <h3>退出登录</h3>
          </div>
          <div class="logout-modal-body">
            <p>确定要退出登录吗？</p>
          </div>
          <div class="logout-modal-footer">
            <button class="cancel-btn" @click="cancelLogout">取消</button>
            <button class="confirm-btn" @click="confirmLogout">确定</button>
          </div>
        </div>
      </div>

      <!-- 发布作品模态框 -->
      <CreatePost v-if="showCreatePost" @close="showCreatePost = false" />

      <!-- 作品详情模态框 -->
      <PostDetail 
        v-if="showPostDetail" 
        :visible="showPostDetail" 
        :postId="currentPostId" 
        @close="closePostDetail" 
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { userApi } from '@/api/user';
import { friendApi } from '@/api/friend';
import { postApi } from '@/api/post';
import { statsApi } from '@/api/stats';
import { tagApi } from '@/api/tag';
import { errorHandler } from '@/utils/errorHandler';
import backgroundImage from '@/assets/background.jpg';
import CreatePost from '@/components/CreatePost.vue';
import PostDetail from '@/components/PostDetail.vue';

const router = useRouter();
const route = useRoute();

// 响应式状态
const isLoggedIn = ref(false);
const username = ref('');
const nickname = ref('');
const userAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'); // 默认头像
const unreadMessages = ref(0); // 未读消息数，实际项目中应从API获取
const showUserDropdown = ref(false); // 用户下拉菜单显示状态
const showLogoutModal = ref(false); // 退出登录提示框显示状态
const friendCount = ref(0); // 好友数量
const postCount = ref(0); // 作品数量
const isBgLoaded = ref(false); // 背景图片加载状态
const isLoading = ref(true); // 页面加载状态

// 模态框状态
const showCreatePost = ref(false);
const showPostDetail = ref(false);
const currentPostId = ref(null);

// 论坛统计数据
const stats = ref({
  totalUsers: 0,
  totalPosts: 0,
  totalComments: 0,
  todayNew: 0
});

// 热门标签列表
const hotTags = ref([]);

// 检查登录状态
const checkLoginStatus = async () => {
  const token = localStorage.getItem('token');
  const storedUsername = localStorage.getItem('username');
  const storedUserId = localStorage.getItem('userId');
  const storedAvatar = localStorage.getItem('userAvatar');

  if (token && storedUsername) {
    isLoggedIn.value = true;
    username.value = storedUsername;
    // 优先使用本地存储的头像，如果没有则使用默认生成
    if (storedAvatar) {
      userAvatar.value = storedAvatar;
    } else {
      userAvatar.value = `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUserId || storedUsername}`;
    }
    // 验证token有效性并获取最新用户信息
    await validateToken();
  } else {
    isLoggedIn.value = false;
    username.value = '';
    userAvatar.value = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
    
    // 自动跳转到登录页面（排除登录和注册页面）
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
      router.push('/login');
    }
  }
  return Promise.resolve(); // 确保函数返回Promise
};

// 验证token有效性并获取用户信息
const validateToken = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (token && userId) {
    try {
      // 并行获取用户信息、好友数量和作品数量
      const [userInfo, friends, posts] = await Promise.all([
        userApi.getUserInfo(userId),
        friendApi.getFriends(userId),
        postApi.getPosts({ userId })
      ]);
      
      // 处理用户信息
      if (userInfo) {
        if (userInfo.avatar) {
          userAvatar.value = userInfo.avatar;
          // 保存头像到本地存储，以便其他组件使用
          localStorage.setItem('userAvatar', userInfo.avatar);
        }
        if (userInfo.nickname) {
          nickname.value = userInfo.nickname;
        }
      }
      
      // 处理好友数量
      friendCount.value = friends ? friends.length : 0;
      
      // 处理作品数量
      postCount.value = posts ? posts.length : 0;
    } catch (error) {
      // token无效，清除登录信息
      clearLoginInfo();
      errorHandler.showError('登录已过期，请重新登录');
      
      // 自动跳转到登录页面
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        router.push('/login');
      }
    }
  }
  return Promise.resolve(); // 确保函数返回Promise
};

// 清除登录信息
const clearLoginInfo = () => {
  // 清除本地存储
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userAvatar');
  
  // 重置状态
  isLoggedIn.value = false;
  username.value = '';
  userAvatar.value = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
};

// 退出登录
const handleLogout = () => {
  showLogoutModal.value = true;
};

// 确认退出登录
const confirmLogout = () => {
  clearLoginInfo();
  showLogoutModal.value = false;
  showUserDropdown.value = false;
  
  // 跳转到登录页面
  router.push('/login');
  
  // 可选：如果后端需要通知登出，可在此调用 API
};

// 取消退出登录
const cancelLogout = () => {
  showLogoutModal.value = false;
};

// 切换用户菜单
const toggleUserMenu = () => {
  if (isLoggedIn.value) {
    showUserDropdown.value = !showUserDropdown.value;
  } else {
    // 未登录时跳转到登录页
    router.push('/login');
  }
};

// 跳转到个人中心
const goToProfile = () => {
  showUserDropdown.value = false;
  const userId = localStorage.getItem('userId') || '1'; // 默认用户ID
  router.push(`/profile/${userId}`);
};

// 跳转到标签页面
const goToTag = (tagName) => {
  router.push(`/tag/${tagName}`);
};

// 跳转到个人空间页面
const navigateToProfile = () => {
  const userId = localStorage.getItem('userId') || '1'; // 默认用户ID
  router.push(`/profile/${userId}`);
};

// 打开发布作品模态框
const openCreatePost = () => {
  showCreatePost.value = true;
};

// 打开作品详情模态框
const openPostDetail = (postId) => {
  currentPostId.value = postId;
  showPostDetail.value = true;
};

// 关闭作品详情模态框
const closePostDetail = () => {
  showPostDetail.value = false;
  currentPostId.value = null;
  // 返回到上一页
  router.back();
};

// 监听路由变化，处理作品详情页面
watch(() => route.path, (newPath) => {
  const postMatch = newPath.match(/^\/post\/(\d+)$/);
  if (postMatch) {
    // 打开作品详情模态框
    openPostDetail(postMatch[1]);
  } else if (showPostDetail.value) {
    // 如果路由不再是作品详情页面，关闭模态框
    closePostDetail();
  }
});

// 提供方法给子组件使用
provide('openCreatePost', openCreatePost);
provide('openPostDetail', openPostDetail);

// 提供全局方法给子组件使用
defineExpose({
  openCreatePost,
  openPostDetail
});

// 获取论坛统计数据
const loadStats = async () => {
  try {
    const data = await statsApi.getStats();
    if (data) {
      stats.value = data;
    }
  } catch (error) {
    console.error('获取论坛统计数据失败:', error);
  }
};

// 获取热门标签
const loadHotTags = async () => {
  try {
    const data = await tagApi.getTags();
    if (data && Array.isArray(data)) {
      hotTags.value = data.map(tag => tag.tagName || tag.name || tag).slice(0, 8);
    }
  } catch (error) {
    console.error('获取热门标签失败:', error);
  }
};

// 预加载背景图片
const preloadBackgroundImage = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      isBgLoaded.value = true;
      resolve();
    };
    img.onerror = () => {
      // 图片加载失败时也 resolve，避免阻塞其他操作
      isBgLoaded.value = true;
      resolve();
    };
  });
};

// 组件挂载时检查状态
onMounted(() => {
  // 并行处理API请求和图片预加载，减少加载时间
  Promise.all([
    checkLoginStatus(),
    loadStats(),
    loadHotTags(),
    preloadBackgroundImage()
  ]).then(() => {
    // 所有请求完成后，设置加载状态为false
    isLoading.value = false;
  }).catch(error => {
    console.error('初始化请求失败:', error);
    // 即使请求失败，也设置加载状态为false，避免页面一直显示加载中
    isLoading.value = false;
  });
  
  // 监听存储变化（例如在其他标签页登录/退出）
  window.addEventListener('storage', checkLoginStatus);
  
  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
  
  // 监听头像更新事件
  window.addEventListener('avatar-updated', handleAvatarUpdate);
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus);
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('avatar-updated', handleAvatarUpdate);
});

// 处理头像更新事件
const handleAvatarUpdate = (event) => {
  if (event.detail && event.detail.avatar) {
    userAvatar.value = event.detail.avatar;
    localStorage.setItem('userAvatar', event.detail.avatar);
  }
};

// 点击其他地方关闭下拉菜单
const handleClickOutside = (event) => {
  const userMenuContainer = document.querySelector('.user-menu-container');
  if (userMenuContainer && !userMenuContainer.contains(event.target)) {
    showUserDropdown.value = false;
  }
};
</script>

<style scoped>
/* ... 原有样式保持不变 ... */

.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 14px;
  transition: background-image 0.5s ease-in-out;
  /* 加载时的背景色 */
  background-color: #f5f5f5;
}

/* 背景图片加载完成后的效果 */
.layout-container.bg-loaded {
  background-color: transparent;
}

/* 加载状态容器 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  transition: opacity 0.3s ease;
}

/* 加载内容 */
.loading-content {
  text-align: center;
  color: #333;
}

/* 加载动画 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

/* 加载文本 */
.loading-text {
  font-size: 16px;
  color: #666;
}

/* 加载动画关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 隐藏滚动条 */
.right-sidebar::-webkit-scrollbar,
.content-area::-webkit-scrollbar {
  display: none;
}

.right-sidebar,
.content-area {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 顶部导航栏样式 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 50px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 20;
  margin: 10px;
  border-radius: 10px;
}

.top-nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}



.top-nav .logo-area {
  margin: 0;
  padding: 0;
  border: none;
}

.top-nav .site-title {
  font-size: 20px;
  color: #d9534f;
  margin: 0;
  font-weight: bold;
}

.top-nav-links {
  display: flex;
  gap: 8px;
}

.top-nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #555;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.top-nav-link:hover {
  color: #d9534f;
  background: rgba(217, 83, 79, 0.1);
}

.top-nav-link.active {
  color: #d9534f;
  background: rgba(217, 83, 79, 0.1);
  font-weight: bold;
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-menu-container {
  position: relative;
}

.nav-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.nav-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-icon {
  font-size: 18px;
  color: #555;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #d9534f;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

/* 下拉菜单样式 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  border: 1px solid #e9ecef;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  color: #555;
  font-size: 14px;
}

.dropdown-item:hover {
  background: rgba(217, 83, 79, 0.1);
  color: #d9534f;
}

.dropdown-item svg {
  flex-shrink: 0;
}

/* 退出登录提示框 */
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.logout-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logout-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.logout-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.logout-modal-body {
  padding: 24px;
}

.logout-modal-body p {
  margin: 0;
  font-size: 16px;
  color: #555;
  text-align: center;
}

.logout-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 24px;
}

.logout-modal .cancel-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  color: #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.logout-modal .cancel-btn:hover {
  border-color: #d9534f;
  color: #d9534f;
}

.logout-modal .confirm-btn {
  padding: 8px 16px;
  border: 1px solid #d9534f;
  background: #d9534f;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.logout-modal .confirm-btn:hover {
  background: #c9302c;
  border-color: #c9302c;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  margin: 10px;
  gap: 15px;
}



/* 中间内容区 */
.content-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
  position: relative;
  min-width: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 确保子元素的fixed定位不受影响 */
  contain: layout style size;
}

/* 确保模态框组件能突破所有容器限制 */
:deep(.create-post-modal),
:deep(.post-detail-modal) {
  position: fixed !important;
  z-index: 1000 !important;
  overflow: visible !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

/* 确保模态框不受父容器overflow影响 */
.layout-container {
  overflow: visible !important;
}

/* 确保主内容区域的overflow不影响模态框 */
.main-content {
  overflow: hidden;
}

/* 确保内容区域的overflow不影响模态框 */
.content-area {
  overflow-y: auto;
  overflow-x: hidden;
}

/* 右侧面板 */
.right-sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 用户信息卡片 */
.user-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid #d9534f;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.user-name-large {
  font-size: 18px;
  font-weight: bold;
  color: #d9534f;
  margin: 0 0 10px 0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.user-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #d9534f;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.user-badges {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.badge {
  background: #f5f5f5;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge.editor {
  background: rgba(217, 83, 79, 0.1);
  color: #d9534f;
}

.action-btn {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #555;
  font-size: 12px;
}

.action-btn:hover {
  background: rgba(217, 83, 79, 0.1);
  border-color: rgba(217, 83, 79, 0.3);
  color: #d9534f;
}

.action-btn svg {
  stroke: currentColor;
}

.login-prompt {
  text-align: center;
}

.login-prompt h3 {
  font-size: 16px;
  color: #d9534f;
  margin: 0 0 10px 0;
}

.login-prompt p {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 统计信息卡片 */
.stats-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid #d9534f;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stats-card h3 {
  font-size: 16px;
  color: #d9534f;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-row .stat-label {
  font-size: 14px;
  color: #666;
}

.stat-row .stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

/* 热门标签卡片 */
.tags-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid #d9534f;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tags-card h3 {
  font-size: 16px;
  color: #d9534f;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(217, 83, 79, 0.1);
  color: #d9534f;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #d9534f;
  color: white;
}

/* 移动端适配 */
@media (max-width: 1200px) {
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .top-nav-links {
    display: none;
  }
  
  .content-area {
    padding: 15px;
  }
}

/* 调整主内容区域布局 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>