<template>
  <div class="friends-page">
    <div class="page-header">
      <h2>好友列表</h2>
      <button class="btn-add-friend" @click="showFriendModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>添加好友</span>
      </button>
    </div>

    <div v-if="loading" class="loading">
      <span>加载中...</span>
    </div>

    <div v-else-if="friends.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>暂无好友</p>
      <p class="empty-tip">点击上方按钮添加好友</p>
    </div>

    <div v-else class="friend-list">
      <div v-for="friend in friends" :key="friend.id" class="friend-card">
        <img :src="friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.friendNickname || friend.friendUsername}`" alt="avatar" class="friend-avatar" @click="navigateToFriendProfile(friend.friendId)" style="cursor: pointer;" />
        <div class="friend-info">
          <h4 class="friend-name">{{ friend.friendNickname || friend.friendUsername }}</h4>
          <p class="friend-status">
            <span class="status-dot" :class="{ online: friend.isOnline }"></span>
            {{ friend.isOnline ? '在线' : '离线' }}
          </p>
        </div>
        <div class="friend-actions">
          <button class="action-btn message-btn" @click="goToChat(friend.friendUsername)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>私信</span>
          </button>
          <button class="action-btn delete-btn" @click="handleDeleteFriend(friend)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加好友和查看申请的悬浮页面 -->
    <div v-if="showFriendModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>好友管理</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'add' }" @click="activeTab = 'add'">
            添加好友
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'requests' }" @click="switchToRequestsTab">
            好友申请
            <span v-if="requestCount > 0" class="badge">{{ requestCount }}</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- 添加好友标签页 -->
          <div v-if="activeTab === 'add'" class="tab-content">
            <div class="add-friend-form">
              <input v-model="friendUsername" placeholder="输入对方用户名" />
            </div>
            
            <!-- 搜索结果 -->
            <div v-if="searchLoading" class="search-loading">
              <span>搜索中...</span>
            </div>
            <div v-else-if="searchResults.length > 0" class="search-results">
              <div v-for="user in searchResults" :key="user.id" class="search-result-item">
                <img :src="user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`" alt="avatar" class="search-result-avatar" />
                <div class="search-result-info">
                  <h4>{{ user.username }}</h4>
                  <p v-if="user.nickname" class="search-result-nickname">{{ user.nickname }}</p>
                </div>
                <button class="btn-add" @click="handleAddFriend(user)">
                  添加好友
                </button>
              </div>
            </div>
            <div v-else-if="friendUsername.trim() && searchResults.length === 0" class="no-results">
              <p>用户不存在</p>
            </div>
            
            <div v-if="addSuccess" class="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>好友请求已发送</span>
            </div>
          </div>

          <!-- 好友申请标签页 -->
          <div v-if="activeTab === 'requests'" class="tab-content">
            <div v-if="loadingRequests" class="loading-mini">
              加载中...
            </div>
            <div v-else-if="requests.length === 0" class="no-requests">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p>暂无好友申请</p>
            </div>
            <div v-else class="request-list">
              <div v-for="req in requests" :key="req.id" class="request-card">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.friendUsername}`" alt="avatar" class="request-avatar" />
                <div class="request-info">
                  <h4>{{ req.friendUsername }}</h4>
                  <p class="request-time">{{ formatTime(req.createTime) }}</p>
                </div>
                <div class="request-actions">
                  <button class="btn-accept" @click="handleResponse(req.id, true)">接受</button>
                  <button class="btn-reject" @click="handleResponse(req.id, false)">拒绝</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h3>删除好友</h3>
        </div>
        <div class="delete-modal-body">
          <p>确定要删除好友 <strong>{{ currentFriend?.friendNickname || currentFriend?.friendUsername }}</strong> 吗？</p>
        </div>
        <div class="delete-modal-footer">
          <button class="btn-cancel" @click="cancelDelete">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { friendApi } from '@/api/friend';
import { userApi } from '@/api/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const loading = ref(false);
const friends = ref([]);
const requests = ref([]);
const friendUsername = ref('');
const addSuccess = ref(false);
const showFriendModal = ref(false);
const showDeleteModal = ref(false);
const currentFriend = ref(null);
const activeTab = ref('add');
const loadingRequests = ref(false);

const userId = localStorage.getItem('userId');

const requestCount = computed(() => requests.value.length);

// 搜索用户相关
const searchResults = ref([]);
const searchLoading = ref(false);
const searchTimer = ref(null);

const loadFriends = async () => {
  loading.value = true;
  try {
    const data = await friendApi.getFriends(userId);
    friends.value = data || [];
  } catch (error) {
    ElMessage.error('获取好友列表失败');
    console.error('获取好友列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const loadRequests = async () => {
  loadingRequests.value = true;
  try {
    const data = await friendApi.getRequests();
    requests.value = data || [];
  } catch (error) {
    ElMessage.error('获取好友申请失败');
    console.error('获取好友申请失败:', error);
  } finally {
    loadingRequests.value = false;
  }
};



const handleResponse = async (id, accept) => {
  try {
    await friendApi.approveRequest({ friendApproveId: id, type: accept ? 1 : 0 });
    ElMessage.success(accept ? '已接受好友请求' : '已拒绝好友请求');
    await loadRequests();
    await loadFriends();
  } catch (error) {
    ElMessage.error('处理好友请求失败');
    console.error('处理好友请求失败:', error);
  }
};

const handleDeleteFriend = (friend) => {
  currentFriend.value = friend;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!currentFriend.value) return;
  try {
    await friendApi.deleteFriend(currentFriend.value.friendId);
    ElMessage.success('删除好友成功');
    showDeleteModal.value = false;
    currentFriend.value = null;
    await loadFriends();
  } catch (error) {
    ElMessage.error('删除好友失败');
    console.error('删除好友失败:', error);
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  currentFriend.value = null;
};

// 搜索用户
const searchUsers = async (username) => {
  if (!username.trim()) {
    searchResults.value = [];
    return;
  }
  
  searchLoading.value = true;
  try {
    const results = await userApi.searchUsers(username);
    searchResults.value = results || [];
  } catch (error) {
    console.error('搜索用户失败:', error);
    searchResults.value = [];
  } finally {
    searchLoading.value = false;
  }
};

// 监听用户名输入，触发搜索
watch(friendUsername, (newVal) => {
  // 清除之前的定时器
  if (searchTimer.value) {
    clearTimeout(searchTimer.value);
  }
  
  // 设置新的定时器，实现防抖
  searchTimer.value = setTimeout(() => {
    searchUsers(newVal);
  }, 300);
});

// 修改添加好友方法，接受用户对象
const handleAddFriend = async (user = null) => {
  const targetUsername = user ? user.username : friendUsername.value.trim();
  if (!targetUsername) return;
  
  try {
    await friendApi.addFriend(targetUsername);
    addSuccess.value = true;
    searchResults.value = [];
    setTimeout(() => {
      addSuccess.value = false;
      friendUsername.value = '';
    }, 2000);
  } catch (error) {
    ElMessage.error(error.message || '添加好友失败');
    console.error('添加好友失败:', error);
  }
};

const closeModal = () => {
  showFriendModal.value = false;
  friendUsername.value = '';
  addSuccess.value = false;
  searchResults.value = [];
};

// 切换到好友申请标签页
const switchToRequestsTab = () => {
  activeTab.value = 'requests';
  loadRequests(); // 加载好友申请列表
};

const goToChat = (friendUsername) => {
  router.push(`/message/${friendUsername}`);
};

// 跳转到好友个人空间页面
const navigateToFriendProfile = (friendId) => {
  router.push(`/profile/${friendId}`);
};

const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  return date.toLocaleDateString();
};

onMounted(() => {
  loadFriends();
});

// 监听弹窗显示状态，当弹窗打开时加载好友申请列表
watch(showFriendModal, (newVal) => {
  if (newVal) {
    loadRequests();
  }
});
</script>

<style scoped>
.friends-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.btn-add-friend {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-add-friend:hover {
  background: #c9302c;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  margin: 10px 0;
  font-size: 16px;
}

.empty-tip {
  font-size: 14px;
  color: #bbb;
}

.friend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.friend-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.friend-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-status {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot.online {
  background: #52c41a;
}

.friend-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.message-btn {
  color: #d9534f;
  border-color: #d9534f;
}

.message-btn:hover {
  background: #d9534f;
  color: white;
}

.delete-btn {
  color: #666;
  border-color: #ddd;
}

.delete-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

/* 悬浮页面样式 */
.modal-overlay {
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #d9534f;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #d9534f;
}

.tab-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #d9534f;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.tab-content {
  min-height: 200px;
}

.add-friend-form {
  margin-bottom: 16px;
}

.add-friend-form input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.add-friend-form input:focus {
  border-color: #d9534f;
  box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.1);
}

.add-friend-form button {
  padding: 10px 20px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.add-friend-form button:hover:not(:disabled) {
  background: #c9302c;
}

.add-friend-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.success-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  color: #52c41a;
  font-size: 14px;
  animation: fadeIn 0.3s ease;
  margin-top: 16px;
}

.search-loading {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.search-results {
  margin-top: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.search-result-item:hover {
  background-color: #f9f9f9;
}

.search-result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-result-info {
  flex: 1;
  min-width: 0;
}

.search-result-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-nickname {
  margin: 0;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-add {
  padding: 6px 12px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-add:hover {
  background: #c9302c;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.no-results p {
  margin: 0;
}

.loading-mini {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-requests {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-requests svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.request-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.request-info {
  flex: 1;
}

.request-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.request-time {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.btn-accept {
  padding: 6px 12px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-accept:hover {
  background: #389e0d;
}

.btn-reject {
  padding: 6px 12px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-reject:hover {
  background: #cf1322;
}

/* 删除确认对话框 */
.delete-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.delete-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.delete-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.delete-modal-body {
  padding: 20px;
}

.delete-modal-body p {
  margin: 0;
  font-size: 16px;
  color: #555;
  text-align: center;
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px 20px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  color: #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-cancel:hover {
  border-color: #d9534f;
  color: #d9534f;
}

.btn-confirm {
  padding: 8px 16px;
  border: 1px solid #d9534f;
  background: #d9534f;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-confirm:hover {
  background: #c9302c;
  border-color: #c9302c;
}
</style>