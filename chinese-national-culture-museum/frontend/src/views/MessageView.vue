<template>
  <div class="message-container">
    <div class="page-header">
      <h2>消息中心</h2>
    </div>
    <div class="message-content">
      <!-- 中间消息列表 -->
      <div class="message-list-container">
        <div class="message-list-header">
          <h3>最近消息</h3>
        </div>
        <div class="message-list-content">
          <div v-if="filteredRecentList.length === 0" class="empty-tip">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>暂无消息</p>
          </div>
          <div v-else>
            <div
              v-for="item in filteredRecentList"
              :key="item.id"
              :class="['message-item-row', { active: friendUsername === item.senderUsername }]"
              @click="selectContact(item.senderUsername)"
            >
              <div class="avatar-container">
                <img :src="item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.senderUsername}`" class="small-avatar" />
                <span v-if="item.unreadCount > 0" class="unread-badge">{{ item.unreadCount }}</span>
              </div>
              <div class="message-item-info">
                <div class="message-item-header">
                  <span class="message-item-name">{{ item.senderNickname || item.senderUsername }}</span>
                  <span class="message-item-time">{{ formatTime(item.createTime) }}</span>
                </div>
                <div class="message-item-content">
                  <span v-if="item.senderUsername === currentUsername" class="message-sender">我: </span>
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-area">
        <div v-if="!friendUsername" class="chat-placeholder">
          <div class="placeholder-content">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=chat" class="placeholder-avatar" />
            <h3>我的消息</h3>
            <p>选择一个联系人开始聊天</p>
          </div>
        </div>
        <div v-else class="chat-container">
          <div class="chat-header">
            <div class="chat-header-info">
              <img :src="currentFriend?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendUsername}`" class="header-avatar" />
              <div class="header-details">
                <h3>{{ currentFriend?.friendNickname || friendUsername }}</h3>
              </div>
            </div>
          </div>

          <div class="chat-content" ref="messageList">
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="['chat-message', msg.senderUsername === currentUsername ? 'self' : 'other']"
            >
              <div class="chat-message-avatar">
                <img :src="msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderUsername}`" class="msg-avatar" />
              </div>
              <div class="chat-message-content">
                <div class="chat-message-header">
                  <span class="chat-message-sender">{{ msg.senderNickname || msg.senderUsername }}</span>
                  <span class="chat-message-time">{{ formatTime(msg.createTime) }}</span>
                </div>
                <div class="chat-message-text">{{ msg.content }}</div>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <textarea v-model="newMessage" placeholder="请输入消息内容" @keyup.enter.prevent="sendMessage"></textarea>
            <button @click="sendMessage" :disabled="!newMessage.trim()" class="send-btn">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { messageApi } from '@/api';
import request from '@/api/request';

const route = useRoute();
const router = useRouter();

const friendUsername = ref(route.params.friendUsername || '');
const currentUsername = localStorage.getItem('username');
const recentList = ref([]);
const messages = ref([]);
const newMessage = ref('');
const messageList = ref(null);
const currentFriend = ref(null);
const searchKeyword = ref('');

// 过滤联系人列表
const filteredRecentList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return recentList.value;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return recentList.value.filter(item => {
    const name = (item.senderNickname || item.senderUsername).toLowerCase();
    const content = item.content.toLowerCase();
    return name.includes(keyword) || content.includes(keyword);
  });
});

// 加载最近联系人列表
const loadRecent = async () => {
  try {
    recentList.value = await messageApi.getRecentList();
  } catch (error) {
    console.error('加载最近聊天失败', error);
  }
};

// 加载聊天记录
const loadConversation = async () => {
  if (!friendUsername.value) return;
  try {
    // 清除消息缓存，确保获取最新数据
    request.clearCache('/message');
    messages.value = await messageApi.getConversation(friendUsername.value);
    
    // 从消息中提取对方信息设置currentFriend
    if (messages.value.length > 0) {
      // 找到好友的信息（如果有好友发送的消息，就用好友的信息）
      const friendMsg = messages.value.find(msg => msg.senderUsername !== '我');
      if (friendMsg) {
        // 构建对方信息对象
        currentFriend.value = {
          friendNickname: friendMsg.senderNickname || friendUsername.value,
          avatar: friendMsg.avatar
        };
      } else {
        // 如果所有消息都是自己发的，尝试从最近联系人列表中获取好友信息
        const recentContact = recentList.value.find(item => item.senderUsername === friendUsername.value);
        if (recentContact) {
          currentFriend.value = {
            friendNickname: recentContact.senderNickname || friendUsername.value,
            avatar: recentContact.avatar
          };
        }
      }
    }
    
    scrollToBottom();
  } catch (error) {
    console.error('加载聊天记录失败', error);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  try {
    await messageApi.sendMessage({
      receiverUsername: friendUsername.value,
      content: newMessage.value.trim()
    });
    
    // 清除消息相关缓存
    request.clearCache('/message');
    
    // 重新加载聊天记录
    await loadConversation();
    
    // 重新加载最近联系人列表
    await loadRecent();
    
    newMessage.value = '';
  } catch (error) {
    alert(error.message);
  }
};

const selectContact = (username) => {
  router.push(`/message/${username}`);
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

onMounted(() => {
  // 清除消息缓存，确保获取最新数据
  request.clearCache('/message');
  
  loadRecent(); // 始终加载最近联系人列表
  if (friendUsername.value) {
    loadConversation();
  }
});

watch(() => route.params.friendUsername, (newVal) => {
  friendUsername.value = newVal || '';
  loadRecent(); // 始终加载最近联系人列表
  if (newVal) {
    loadConversation();
  }
});
</script>

<style scoped>
.message-container {
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 16px 24px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.message-content {
  flex: 1;
  display: flex;
  min-height: 0;
  background: #f0f2f5;
}

/* 中间消息列表 */
.message-list-container {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-list-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f9f9f9;
}

.message-list-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.message-list-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-list-content::-webkit-scrollbar {
  display: none;
}

.message-item-row {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.message-item-row:hover {
  background: #f9f9f9;
}

.message-item-row.active {
  background: #f0f0f0;
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.small-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #d9534f;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.message-item-info {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.message-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-item-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.message-item-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.message-item-content {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.message-sender {
  color: #999;
  font-size: 12px;
  margin-right: 4px;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 60px 20px;
  font-size: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-tip svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-tip p {
  margin: 0;
}

/* 右侧聊天区域 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #f0f2f5;
}

.chat-placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

.placeholder-content {
  text-align: center;
  color: #999;
}

.placeholder-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
  opacity: 0.5;
}

.placeholder-content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.placeholder-content p {
  margin: 0;
  font-size: 14px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #fff;
  margin: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  overflow: hidden;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  background: #fff;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f9f9f9;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-content::-webkit-scrollbar {
  display: none;
}

.chat-message {
  display: flex;
  gap: 12px;
  max-width: 70%;
  animation: messageSlideIn 0.3s ease;
  align-items: flex-start;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.self {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-message-avatar {
  flex-shrink: 0;
  margin-top: 2px;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-message-content {
  flex: 0 1 auto;
  min-width: 0;
}

.chat-message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.chat-message-sender {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.chat-message.self .chat-message-sender {
  color: #fff;
}

.chat-message-time {
  font-size: 11px;
  color: #999;
  margin-left: 8px;
}

.chat-message.self .chat-message-time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-message-text {
  background: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  word-wrap: break-word;
  line-height: 1.4;
  max-width: 100%;
  min-width: 60px;
}

.chat-message.self .chat-message-text {
  background: #d9534f;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.other .chat-message-text {
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
  background: #fff;
  min-height: 80px;
  flex-shrink: 0;
  gap: 12px;
}

.chat-input textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  font-size: 14px;
  background: #f9f9f9;
  transition: all 0.3s;
  line-height: 1.4;
}

.chat-input textarea:focus {
  outline: none;
  border-color: #d9534f;
  box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.2);
  background: #fff;
}

.send-btn {
  padding: 0 24px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 80px;
  height: 40px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #c9302c;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(217, 83, 79, 0.3);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>