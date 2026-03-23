<template>
  <div class="user-profile">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="fetchUserInfo">重试</button>
    </div>

    <!-- 个人空间内容 -->
    <div v-else>
      <!-- 顶部背景 -->
      <div class="profile-header" :style="bannerStyle">
      </div>
      
      <!-- 用户信息区域 -->
      <div class="profile-content">
        <div class="profile-info">
          <img :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userInfo.username" :alt="userInfo.username" class="avatar" />
          <div class="user-details">
            <h1 class="username">{{ userInfo.nickname || userInfo.username || '未知用户' }}</h1>
            <p class="user-nickname">{{ userInfo.username || userInfo.nickname }}</p>
            <p class="bio">{{ userInfo.bio || '这个人很懒，还没有填写个人简介' }}</p>
            <div class="user-meta">
              <div class="meta-item">
                <span class="label">民族：</span>
                <span class="value">{{ userInfo.ethnicity || '未填写' }}</span>
              </div>
              <div class="meta-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ userInfo.email || '未填写' }}</span>
              </div>
            </div>
            <div class="tags-container">
              <span class="tag" v-for="tag in userInfo.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- 导航栏 -->
        <div class="profile-nav">
          <div class="nav-item" :class="{ active: activeTab === 'works' }" @click="activeTab = 'works'">作品</div>
          <div class="nav-item" :class="{ active: activeTab === 'collections' }" @click="activeTab = 'collections'">收藏</div>
        </div>

        <!-- 作品列表 -->
        <div class="works-container" v-if="activeTab === 'works'">
          <div v-if="userWorks.length === 0" class="empty-works">
            <p>暂无作品</p>
          </div>
          <div class="work-item" v-for="work in userWorks" :key="work.id" @click="openWorkDetail(work.id)">
            <img :src="work.image" :alt="work.title" class="work-image" />
            <div class="work-info">
              <h3 class="work-title">{{ work.title }}</h3>
              <p class="work-desc">{{ work.description }}</p>
            </div>
          </div>
        </div>

        <!-- 收藏列表 -->
        <div class="works-container" v-if="activeTab === 'collections'">
          <div v-if="userCollections.length === 0" class="empty-works">
            <p>暂无收藏</p>
          </div>
          <div class="work-item" v-for="collection in userCollections" :key="collection.id" @click="openWorkDetail(collection.id)">
            <img :src="collection.image" :alt="collection.title" class="work-image" />
            <div class="work-info">
              <h3 class="work-title">{{ collection.title }}</h3>
              <p class="work-desc">{{ collection.description }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 作品详情模态框 -->
    <teleport to="body">
      <PostDetail 
        v-if="showPostDetail" 
        :visible="showPostDetail" 
        :postId="currentPostId" 
        @close="showPostDetail = false" 
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { userApi } from '../api/user';
import { postApi } from '../api/post';
import PostDetail from '../components/PostDetail.vue';

const route = useRoute();
const userId = ref(route.params.id || '1'); // 默认用户ID

const userInfo = ref({
  id: '',
  username: '',
  nickname: '',
  avatar: '',
  banner: '',
  bio: '',
  ethnicity: '',
  email: '',
  tags: []
});

// 横幅背景样式
const bannerStyle = computed(() => {
  if (userInfo.value.banner) {
    return {
      backgroundImage: `url(${userInfo.value.banner})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return {
    backgroundImage: 'url(https://i.pravatar.cc/1200/300?img=3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
});

const loading = ref(true);
const error = ref('');
const userWorks = ref([]);
const userCollections = ref([]);
const activeTab = ref('works');
const showPostDetail = ref(false);
const currentPostId = ref('');

const openWorkDetail = (id) => {
  currentPostId.value = id;
  showPostDetail.value = true;
};

const fetchUserInfo = async () => {
  try {
    loading.value = true;
    error.value = '';
    // 调用后端接口获取用户信息
    console.log('Fetching user info for ID:', userId.value);
    const userData = await userApi.getUserInfo(userId.value);
    console.log('User data:', userData);
    userInfo.value = {
      id: userId.value,
      username: userData.username || '',
      nickname: userData.nickname || '',
      avatar: userData.avatar || '',
      banner: userData.banner || '',
      bio: userData.bio || '',
      ethnicity: userData.ethnicGroup || '',
      email: userData.email || '',
      tags: userData.interestTags || []
    };
  } catch (err) {
    console.error('Error fetching user info:', err);
    error.value = err.message || '获取用户信息失败';
  } finally {
    loading.value = false;
  }
};

const fetchUserWorks = async () => {
  try {
    loading.value = true;
    error.value = '';
    // 调用后端接口获取用户作品
    console.log('Fetching user works for ID:', userId.value);
    const postsData = await postApi.getUserPosts(userId.value);
    console.log('Works data:', postsData);
    userWorks.value = postsData.map(post => ({
      id: post.id,
      title: post.title,
      description: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
      image: post.fileUrl || 'https://i.pravatar.cc/300?img=1'
    }));
  } catch (err) {
    console.error('Error fetching user works:', err);
    error.value = err.message || '获取用户作品失败';
  } finally {
    loading.value = false;
  }
};

const fetchUserCollections = async () => {
  try {
    loading.value = true;
    error.value = '';
    // 调用后端接口获取用户收藏
    console.log('Fetching user collections for ID:', userId.value);
    const collectionsData = await postApi.getMyCollections();
    console.log('Collections data:', collectionsData);
    userCollections.value = collectionsData.map(collection => ({
      id: collection.id,
      title: collection.title,
      description: collection.content.substring(0, 100) + (collection.content.length > 100 ? '...' : ''),
      image: collection.fileUrl || 'https://i.pravatar.cc/300?img=1'
    }));
  } catch (err) {
    console.error('Error fetching user collections:', err);
    error.value = err.message || '获取用户收藏失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
  fetchUserWorks();
  fetchUserCollections();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    userId.value = newId; // 更新 userId 的值
    fetchUserInfo();
    fetchUserWorks();
    fetchUserCollections();
  }
});
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  background: #f5f5f5;
  overflow: visible;
}

.profile-header {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: #f0f0f0;
  background-size: cover;
  background-position: center;
  opacity: 0.9;
  z-index: 1;
}

.profile-content {
  width: 100%;
  position: relative;
  top: -150px;
  z-index: 2;
  margin-bottom: 0;
}

.profile-info {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 0 20px;
  margin-bottom: 0;
  box-sizing: border-box;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-right: 20px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  color: white;
}

.username {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
}

.user-nickname {
  font-size: 14px;
  margin: 0 0 15px 0;
  opacity: 0.8;
  color: white;
}

.bio {
  font-size: 16px;
  margin: 0 0 15px 0;
  opacity: 0.9;
  color: white;
}

.user-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: white;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.meta-item .label {
  margin-right: 5px;
  opacity: 0.8;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(217, 83, 79, 0.3);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid rgba(217, 83, 79, 0.5);
}

.profile-nav {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: none;
  border-radius: 0;
  margin: 0 20px;
  margin-top: 0;
  margin-bottom: 0;
  box-shadow: none;
  z-index: 1;
}

.nav-item {
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #d9534f;
}

.nav-item.active {
  color: #d9534f;
  border-bottom-color: #d9534f;
}

.works-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 10px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 0;
  position: relative;
  z-index: 1;
}

.work-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(217, 83, 79, 0.3);
}

.work-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.work-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.work-info {
  padding: 15px;
}

.work-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.work-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .user-details {
    width: 100%;
  }
  
  .user-meta {
    justify-content: center;
  }
  
  .works-container {
    grid-template-columns: 1fr;
  }
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(217, 83, 79, 0.2);
  border-top: 4px solid #d9534f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 16px;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 20px;
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid rgba(217, 83, 79, 0.3);
}

.error-message {
  color: #d9534f;
  font-size: 16px;
  margin: 0;
}

.retry-btn {
  padding: 10px 20px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #c9302c;
}

/* 空作品状态 */
.empty-works {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(217, 83, 79, 0.3);
}
</style>