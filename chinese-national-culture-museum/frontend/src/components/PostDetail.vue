<template>
  <div class="post-detail-modal" v-if="visible" @click.self="closeModal">
    <div class="post-detail-container" :class="{ 'no-media': !post?.fileUrl }">
      <!-- 左侧：作品图片 -->
      <div v-if="post?.fileUrl" class="post-media-section">
        <div class="media-container">
          <img v-if="isImage(post.fileUrl)" :src="post.fileUrl" alt="作品图片" class="post-media" />
          <video v-else-if="isVideo(post.fileUrl)" :src="post.fileUrl" controls class="post-media"></video>
        </div>
      </div>

      <!-- 右侧：作品信息 -->
      <div class="post-info-section" :class="{ 'full-width': !post?.fileUrl }">
        <!-- 作者信息 -->
        <div class="author-header">
          <div class="author-info">
            <img :src="post?.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post?.authorName}`" class="author-avatar" />
            <span class="author-name">{{ post?.authorName }}</span>
          </div>
          <button 
            v-if="!isFriend"
            class="add-friend-btn" 
            @click="sendFriendRequest"
            :disabled="sendingFriendRequest || isFriendRequestSent"
          >
            {{ isFriendRequestSent ? '已发送' : '+' }}
          </button>
        </div>

        <!-- 作品标题和基本信息 -->
        <div class="post-header-area">
          <h1 class="post-title">{{ post?.title }}</h1>
          
          <!-- 标签 -->
          <div v-if="post?.tags && post.tags.length > 0" class="tags-list">
            <span v-for="(tag, index) in post.tags" :key="index" class="tag-item">
              #{{ tag }}
            </span>
          </div>
          
          <!-- 作品信息 -->
          <div class="post-meta-info">
            <span v-if="post?.ethnicGroup" class="meta-item">
              <span class="meta-label">民族：</span>
              <span class="meta-value">{{ post.ethnicGroup }}</span>
            </span>
            <span v-if="post?.region" class="meta-item">
              <span class="meta-label">地区：</span>
              <span class="meta-value">{{ post.region }}</span>
            </span>
          </div>
        </div>

        <!-- 作品内容 -->
        <div class="post-content-area">
          <div class="post-description">{{ post?.content }}</div>
        </div>

        <!-- 评论区 -->
        <div class="comments-area">
          <div class="comments-header">
            <span class="comments-count">共 {{ post?.comments || 0 }} 条评论</span>
          </div>
          
          <!-- 评论列表 -->
          <div class="comments-list" ref="commentsList">
            <div v-if="loadingComments" class="loading-spinner"></div>
            <div v-else-if="comments.length === 0" class="no-comments">
              暂无评论，快来抢沙发吧！
            </div>
            <div v-else>
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-user">
                  <img :src="comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.username}`" class="comment-avatar" />
                  <span class="comment-username">{{ comment.nickname || comment.username }}</span>
                </div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-time">
                  {{ formatDate(comment.createTime) }}
                  <span class="reply-btn" @click="showReplyInput(comment)">回复</span>
                </div>
                
                <!-- 回复列表 -->
                <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                  <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                    <div class="reply-user">
                      <img :src="reply.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.username}`" class="reply-avatar" />
                      <span class="reply-username">{{ reply.nickname || reply.username }}</span>
                    </div>
                    <div class="reply-text">{{ reply.content }}</div>
                    <div class="reply-time">
                      {{ formatDate(reply.createTime) }}
                      <span class="reply-btn" @click="showReplyInput(reply)">回复</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="post-actions-bar">
          <div class="action-input">
            <input 
              v-model="commentContent"
              type="text"
              :placeholder="replyUser ? `回复 @${replyUser.nickname || replyUser.username}` : '说点什么...'"
              class="comment-input"
              @keyup.enter="submitComment"
            />
          </div>
          <div class="action-buttons">
            <button 
              @click="handleLike" 
              class="action-btn" 
              :class="{ 'active': isLiked }"
              :disabled="liking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="action-count">{{ post?.likeCount || 0 }}</span>
            </button>
            <button 
              @click="handleCollect" 
              class="action-btn" 
              :class="{ 'active': isCollected }"
              :disabled="collecting"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isCollected ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span class="action-count">{{ post?.collects || 0 }}</span>
            </button>
            <button class="action-btn" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span class="action-count">{{ post?.comments || 0 }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { postApi } from '@/api/post';
import { collectApi } from '@/api/collect';
import { likeApi } from '@/api/like';
import { commentApi } from '@/api/comment';
import { friendApi } from '@/api/friend';
import { errorHandler } from '@/utils/errorHandler';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  postId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close']);

const loading = ref(false);
const error = ref(null);
const post = ref(null);

// 收藏相关状态
const isCollected = ref(false);
const collecting = ref(false);

// 点赞相关状态
const isLiked = ref(false);
const liking = ref(false);

// 好友申请相关状态
const isFriendRequestSent = ref(false);
const sendingFriendRequest = ref(false);
const isFriend = ref(false);
const friendsList = ref([]);

// 评论相关状态
const comments = ref([]);
const loadingComments = ref(false);
const commentContent = ref('');
const submittingComment = ref(false);
const replyTo = ref(null); // 回复的评论ID
const replyUser = ref(null); // 回复的用户信息

// 检查是否为图片
const isImage = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// 检查是否为视频
const isVideo = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)$/i.test(url);
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 关闭弹窗
const closeModal = () => {
  emit('close');
};

// 获取作品详情
const fetchPostDetail = async () => {
  if (!props.postId) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const data = await postApi.getPostDetail(props.postId);
    post.value = data;
    // 检查点赞状态
    await checkLikeStatus();
    // 检查收藏状态
    await checkCollectStatus();
    // 检查是否是好友
    await checkFriendStatus();
  } catch (err) {
    error.value = err.message || '加载失败，请检查网络连接';
    errorHandler.handleApiError(err);
  } finally {
    loading.value = false;
  }
};

// 检查收藏状态
const checkCollectStatus = async () => {
  if (!post.value) return;
  
  try {
    const status = await collectApi.checkCollectStatus(post.value.id);
    isCollected.value = status;
  } catch (err) {
    console.error('检查收藏状态失败:', err);
  }
};

// 获取好友列表并检查是否是好友
const checkFriendStatus = async () => {
  if (!post.value) return;
  
  const currentUserId = localStorage.getItem('userId');
  if (!currentUserId) return;
  
  try {
    const friends = await friendApi.getFriends(currentUserId);
    friendsList.value = friends;
    // 检查作品作者是否在好友列表中，或者是否是自己
    isFriend.value = friends.some(friend => friend.friendId === post.value.userId || friend.id === post.value.userId) || 
                     post.value.userId === currentUserId;
  } catch (err) {
    console.error('获取好友列表失败:', err);
  }
};

// 检查点赞状态
const checkLikeStatus = async () => {
  if (!post.value) return;
  
  try {
    const status = await likeApi.checkLikeStatus(post.value.id);
    isLiked.value = status;
  } catch (err) {
    console.error('检查点赞状态失败:', err);
  }
};

// 点赞/取消点赞
const handleLike = async () => {
  if (!post.value) return;
  if (liking.value) return;
  
  liking.value = true;
  try {
    if (isLiked.value) {
      await likeApi.unlikePost(post.value.id);
      post.value.likeCount--;
      isLiked.value = false;
    } else {
      await likeApi.likePost(post.value.id);
      post.value.likeCount++;
      isLiked.value = true;
    }
  } catch (err) {
    errorHandler.handleApiError(err);
  } finally {
    liking.value = false;
  }
};

// 收藏/取消收藏
const handleCollect = async () => {
  if (!post.value) return;
  if (collecting.value) return;
  
  collecting.value = true;
  try {
    if (isCollected.value) {
      await collectApi.uncollectPost(post.value.id);
      post.value.collects--;
      isCollected.value = false;
    } else {
      await collectApi.collectPost(post.value.id);
      post.value.collects++;
      isCollected.value = true;
    }
  } catch (err) {
    errorHandler.handleApiError(err);
  } finally {
    collecting.value = false;
  }
};

// 发送好友申请
const sendFriendRequest = async () => {
  if (!post.value?.authorUsername) return;
  if (sendingFriendRequest.value || isFriendRequestSent.value) return;
  
  sendingFriendRequest.value = true;
  try {
    await friendApi.addFriend(post.value.authorUsername);
    isFriendRequestSent.value = true;
    ElMessage.success('好友申请已发送！');
  } catch (err) {
    // errorHandler 已经显示了错误提示，这里不再重复显示
    console.error('发送好友申请失败:', err);
  } finally {
    sendingFriendRequest.value = false;
  }
};

// 获取评论列表
const fetchComments = async () => {
  if (!post.value) return;
  
  loadingComments.value = true;
  try {
    // 清除评论相关缓存，确保获取最新数据
    import('@/api/request').then(({ default: request }) => {
      request.clearCache('/comments');
    });
    const data = await commentApi.getCommentsByPostId(post.value.id);
    comments.value = data;
  } catch (err) {
    errorHandler.handleApiError(err);
  } finally {
    loadingComments.value = false;
  }
};

// 显示回复输入框
const showReplyInput = (comment) => {
  replyTo.value = comment.id;
  replyUser.value = comment;
  // 自动聚焦到输入框
  setTimeout(() => {
    const input = document.querySelector('.comment-input');
    if (input) {
      input.focus();
    }
  }, 100);
};

// 发布评论
const submitComment = async () => {
  if (!post.value || !commentContent.value.trim()) return;
  if (submittingComment.value) return;
  
  submittingComment.value = true;
  try {
    const comment = {
      postId: post.value.id,
      content: commentContent.value.trim(),
      userId: localStorage.getItem('userId'),
      parentId: replyTo.value || null
    };
    await commentApi.createComment(comment);
    commentContent.value = '';
    replyTo.value = null;
    replyUser.value = null;
    // 清除评论缓存，确保获取最新数据
    await import('@/api/request').then(({ default: request }) => {
      request.clearCache('/comments');
    });
    await fetchComments();
    // 更新帖子评论数
    post.value.comments++;
  } catch (err) {
    errorHandler.handleApiError(err);
  } finally {
    submittingComment.value = false;
  }
};

// 监听postId变化
watch(() => props.postId, (newId) => {
  if (newId && props.visible) {
    fetchPostDetail();
    fetchComments();
  }
});

// 监听visible变化
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.postId) {
    fetchPostDetail();
    fetchComments();
  }
});

onMounted(async () => {
  if (props.visible && props.postId) {
    await fetchPostDetail();
    await fetchComments();
  }
});
</script>

<style scoped>
.post-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  overflow: visible !important;
}

.post-detail-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.post-detail-container.no-media {
  max-width: 500px;
}

.post-info-section.full-width {
  width: 100%;
}

/* 左侧：作品图片 */
.post-media-section {
  flex: 1;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.media-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 右侧：作品信息 */
.post-info-section {
  width: 550px;
  display: flex;
  flex-direction: column;
  background: #fff;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.post-info-section::-webkit-scrollbar {
  display: none;
}

/* 作者信息 */
.author-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-friend-btn {
  width: 32px;
  height: 32px;
  background: #ff2442;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}

.add-friend-btn:hover:not(:disabled) {
  background: #e02040;
  transform: scale(1.1);
}

.add-friend-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  font-size: 12px;
  width: auto;
  padding: 6px 12px;
  border-radius: 12px;
}

/* 作品标题和基本信息 */
.post-header-area {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  word-wrap: break-word;
  word-break: break-word;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.tag-item {
  font-size: 12px;
  color: #ff2442;
  cursor: pointer;
}

.post-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.meta-label {
  color: #666;
}

/* 作品内容 */
.post-content-area {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  max-height: 350px;
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
}

.post-content-area::-webkit-scrollbar {
  display: none;
}

.post-description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
}

/* 评论区 */
.comments-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.comments-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comments-count {
  font-size: 14px;
  color: #999;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px 20px;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.comments-list::-webkit-scrollbar {
  display: none;
}

.comment-item {
  margin-bottom: 20px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 4px;
  padding-left: 40px;
}

.comment-time {
  font-size: 12px;
  color: #999;
  padding-left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.reply-time {
  font-size: 11px;
  color: #999;
  padding-left: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.reply-btn {
  color: #666;
  cursor: pointer;
  font-size: 12px;
  transition: color 0.3s;
}

.reply-btn:hover {
  color: #ff2442;
}

.replies-list {
  margin-top: 12px;
  margin-left: 40px;
  padding-left: 15px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  margin-bottom: 12px;
}

.reply-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.reply-username {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.reply-text {
  font-size: 13px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 2px;
  padding-left: 32px;
}

.reply-time {
  font-size: 11px;
  color: #999;
  padding-left: 32px;
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff2442;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 底部操作栏 */
.post-actions-bar {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-input {
  width: 100%;
}

.comment-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.comment-input:focus {
  border-color: #ff2442;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  padding: 8px 12px;
  border-radius: 8px;
}

.action-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.action-btn:disabled {
  cursor: default;
  opacity: 0.6;
}

.action-btn.active {
  color: #ff2442;
}

.action-count {
  font-size: 13px;
}

/* 关闭按钮 */
.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  transition: all 0.3s;
  z-index: 1001;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

/* 响应式 */
@media (max-width: 768px) {
  .post-detail-container {
    flex-direction: column;
    height: 100vh;
    border-radius: 0;
  }
  
  .post-media-section {
    height: 40%;
  }
  
  .post-info-section {
    width: 100%;
    height: 60%;
  }
}
</style>