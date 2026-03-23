<template>
  <div class="create-post-modal">
    <div class="create-post-container">
      <!-- 头部 -->
      <div class="create-post-header">
        <div class="post-visibility">
          <select v-model="form.visibility" class="visibility-select">
            <option value="1">公开</option>
            <option value="2">私密</option>
          </select>
        </div>
        <button @click="cancel" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- 内容区域 -->
      <form @submit.prevent="handleSubmit" class="create-post-form">
        <!-- 标题输入 -->
        <div class="title-input-area">
          <input 
            type="text" 
            v-model="form.title" 
            placeholder="标题"
            class="title-input"
            required
          />
        </div>
        
        <!-- 内容输入 -->
        <div class="content-input-area">
          <textarea 
            v-model="form.content" 
            placeholder="分享你的作品..."
            class="content-textarea"
            required
          ></textarea>
        </div>
        
        <!-- 文件预览 -->
        <div v-if="form.fileUrl" class="file-preview">
          <img 
            v-if="isImage(form.fileUrl)" 
            :src="form.fileUrl" 
            alt="预览" 
            class="preview-image"
          />
          <video 
            v-else-if="isVideo(form.fileUrl)" 
            :src="form.fileUrl" 
            controls 
            class="preview-video"
          ></video>
          <div class="file-info">
            <span class="file-name">{{ getFileName(form.fileUrl) }}</span>
            <button 
              type="button" 
              @click="removeFile" 
              class="remove-file-btn"
            >
              ×
            </button>
          </div>
        </div>
        
        <!-- 功能按钮 -->
        <div class="action-buttons">
          <input 
            ref="fileInput"
            type="file" 
            @change="handleFileUpload" 
            accept="image/*,video/*"
            class="file-input"
          />
          <button type="button" class="action-btn" @click="$refs.fileInput.click()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
          
          <!-- 标签按钮 -->
          <button type="button" class="action-btn" @click="showTagsInput = !showTagsInput">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
          </button>
        </div>
        
        <!-- 标签输入 -->
        <div v-if="showTagsInput" class="tags-input-area">
          <input 
            type="text" 
            v-model="tagInput" 
            placeholder="输入标签后按回车添加"
            @keydown.enter.prevent="addTag"
            class="tag-input"
          />
          
          <!-- 标签选择列表 -->
          <div v-if="!loadingTags && tags.length > 0" class="tags-select-list">
            <span 
              v-for="tag in tags"
              :key="tag.name || tag"
              :class="['tag-select-item', { active: form.tagNames.includes(tag.name || tag) }]"
              @click="selectTag(tag)"
            >
              {{ tag.name || tag }}
            </span>
          </div>
          
          <!-- 加载标签提示 -->
          <div v-if="loadingTags" class="tags-loading">
            加载标签中...
          </div>
          
          <!-- 已选标签 -->
          <div class="tags-list">
            <span 
              v-for="(tag, index) in form.tagNames"
              :key="index" 
              class="tag-item"
            >
              {{ tag }}
              <button 
                type="button" 
                @click="removeTag(index)"
                class="remove-tag-btn"
              >
                ×
              </button>
            </span>
          </div>
        </div>
        
        <!-- 发布按钮 -->
        <div class="post-submit">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '发布中...' : '发布' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { postApi } from '@/api/post';
import { errorHandler } from '@/utils/errorHandler';
import { uploadApi } from '@/api/upload';
import { tagApi } from '@/api/tag';

const emit = defineEmits(['close']);
const loading = ref(false);
const tagInput = ref('');
const showTagsInput = ref(false);
const tags = ref([]);
const loadingTags = ref(false);

// 加载标签
const loadTags = async () => {
  try {
    loadingTags.value = true;
    const response = await tagApi.getTags();
    tags.value = response || [];
  } catch (error) {
    errorHandler.handleApiError(error);
  } finally {
    loadingTags.value = false;
  }
};

// 组件挂载时加载标签
onMounted(() => {
  loadTags();
});

// 表单数据
const form = reactive({
  title: '',
  content: '',
  fileUrl: '',
  visibility: 1,
  tagNames: []
});

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    loading.value = true;
    const response = await uploadApi.uploadPostFile(file);
    form.fileUrl = response;
  } catch (error) {
    errorHandler.handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// 移除文件
const removeFile = () => {
  form.fileUrl = '';
};

// 检查是否为图片
const isImage = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// 检查是否为视频
const isVideo = (url) => {
  return /\.(mp4|webm|ogg)$/i.test(url);
};

// 添加标签
const addTag = () => {
  const tags = tagInput.value.trim();
  if (tags && !form.tagNames.includes(tags)) {
    form.tagNames.push(tags);
    tagInput.value = '';
  }
};

// 选择标签
const selectTag = (tag) => {
  const tagName = tag.name || tag;
  if (form.tagNames.includes(tagName)) {
    // 如果已选中，则移除
    const index = form.tagNames.indexOf(tagName);
    form.tagNames.splice(index, 1);
  } else {
    // 如果未选中，则添加
    form.tagNames.push(tagName);
  }
};

// 移除标签
const removeTag = (index) => {
  form.tagNames.splice(index, 1);
};

// 获取文件名
const getFileName = (url) => {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// 提交表单
const handleSubmit = async () => {
  try {
    loading.value = true;
    await postApi.createPost(form);
    errorHandler.showError('发布成功');
    emit('close');
  } catch (error) {
    errorHandler.handleApiError(error);
  } finally {
    loading.value = false;
  }
};

// 取消
const cancel = () => {
  emit('close');
};
</script>

<style scoped>
/* 悬浮页面 */
.create-post-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: visible !important;
}

/* 确保模态框不受父容器限制 */
:deep(.create-post-modal) {
  position: fixed !important;
  z-index: 1000 !important;
  overflow: visible !important;
}

.create-post-container {
  width: 100%;
  max-width: 600px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

/* 头部 */
.create-post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.post-visibility {
  position: relative;
  display: inline-block;
}

.visibility-select {
  padding: 8px 28px 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: #333;
  min-width: 100px;
}

.visibility-select:focus {
  border-color: #ff2442;
  box-shadow: 0 0 0 2px rgba(255, 36, 66, 0.1);
}

.visibility-select:hover {
  border-color: #ff2442;
}

.post-visibility::after {
  content: '▼';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #666;
  pointer-events: none;
  transition: all 0.3s;
}

.post-visibility:hover::after {
  color: #ff2442;
}

/* 自定义下拉列表样式 */
.visibility-select option {
  padding: 10px;
  font-size: 14px;
  background: #fff;
  color: #333;
}

.visibility-select option:hover {
  background: #f5f5f5;
}

.visibility-select option:checked {
  background: #f0f0f0;
  color: #333;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f0f0f0;
}

/* 表单 */
.create-post-form {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.create-post-form::-webkit-scrollbar {
  display: none;
}

/* 内容输入 */
.title-input-area {
  padding: 0 16px 12px;
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.title-input::placeholder {
  color: #999;
}

.content-input-area {
  flex: 1;
  padding: 0 16px;
}

.content-textarea {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  min-height: 120px;
  color: #333;
}

.content-textarea::placeholder {
  color: #999;
}

/* 文件预览 */
.file-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
  margin: 10px 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.remove-file-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.remove-file-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* 功能按钮 */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.file-input {
  display: none;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f5f5f5;
  color: #333;
}

/* 地区输入 */
.location-input {
  display: flex;
  gap: 8px;
  flex: 1;
}

.location-text {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  background: #f9f9f9;
}

.location-text:focus {
  border-color: #ff2442;
  background: #fff;
}

/* 标签输入 */
.tags-input-area {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.tag-input {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  margin-bottom: 8px;
  background: #fff;
}

.tag-input:focus {
  border-color: #ff2442;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ff2442;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

/* 标签选择列表 */
.tags-select-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  max-height: 120px;
  overflow-y: auto;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.tags-select-list::-webkit-scrollbar {
  width: 4px;
}

.tags-select-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tags-select-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.tags-select-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.tag-select-item {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-select-item:hover {
  background: #f5f5f5;
  border-color: #ff2442;
}

.tag-select-item.active {
  background: #ff2442;
  border-color: #ff2442;
  color: #fff;
}

/* 加载标签提示 */
.tags-loading {
  text-align: center;
  padding: 12px;
  color: #999;
  font-size: 14px;
}

/* 发布按钮 */
.post-submit {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.submit-btn {
  background: #ff2442;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #e02040;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>