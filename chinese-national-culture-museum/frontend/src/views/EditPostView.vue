<template>
  <div class="edit-post-container">
    <h1 class="page-title">编辑作品</h1>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <form v-else @submit.prevent="handleSubmit" class="edit-post-form">
      <!-- 标题输入 -->
      <div class="form-group">
        <label for="title">标题</label>
        <input 
          type="text" 
          id="title" 
          v-model="form.title" 
          placeholder="请输入作品标题"
          required
        />
      </div>
      
      <!-- 内容输入 -->
      <div class="form-group">
        <label for="content">正文</label>
        <textarea 
          id="content" 
          v-model="form.content" 
          placeholder="请输入作品内容"
          rows="10"
          required
        ></textarea>
      </div>
      
      <!-- 文件上传 -->
      <div class="form-group">
        <label>上传文件</label>
        <div class="file-upload-area">
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept="image/*,video/*"
            class="file-input"
          />
          <div class="upload-hint">
            <span class="upload-icon">📁</span>
            <span>点击或拖拽文件到此处上传</span>
          </div>
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
            <button 
              type="button" 
              @click="removeFile" 
              class="remove-file-btn"
            >
              ×
            </button>
          </div>
        </div>
      </div>
      
      <!-- 民族选择 -->
      <div class="form-group">
        <label for="ethnicGroup">所属民族</label>
        <input 
          type="text" 
          id="ethnicGroup" 
          v-model="form.ethnicGroup" 
          placeholder="请输入所属民族"
        />
      </div>
      
      <!-- 地区选择 -->
      <div class="form-group">
        <label for="region">所属地区</label>
        <input 
          type="text" 
          id="region" 
          v-model="form.region" 
          placeholder="请输入所属地区（省市区）"
        />
      </div>
      
      <!-- 可见性选择 -->
      <div class="form-group">
        <label for="visibility">可见性</label>
        <select id="visibility" v-model="form.visibility">
          <option value="1">公开</option>
          <option value="2">仅好友</option>
        </select>
      </div>
      
      <!-- 标签输入 -->
      <div class="form-group">
        <label for="tags">标签</label>
        <div class="tags-input-container">
          <input 
            type="text" 
            id="tags" 
            v-model="tagInput" 
            placeholder="输入标签后按回车添加"
            @keydown.enter.prevent="addTag"
          />
          <div class="tags-list">
            <span 
              v-for="(tags, index) in form.tagNames"
              :key="index" 
              class="tags-item"
            >
              {{ tags }}
              <button 
                type="button" 
                @click="removeTag(index)"
                class="remove-tags-btn"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      </div>
      
      <!-- 提交按钮 -->
      <div class="form-actions">
        <button type="button" @click="cancel" class="btn btn-cancel">取消</button>
        <button type="submit" class="btn btn-submit" :disabled="submitting">
          {{ submitting ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { postApi } from '@/api/post';
import { errorHandler } from '@/utils/errorHandler';
import { uploadApi } from '@/api/upload';

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const submitting = ref(false);
const tagInput = ref('');
const postId = route.params.id;

// 表单数据
const form = reactive({
  title: '',
  content: '',
  fileUrl: '',
  ethnicGroup: '',
  region: '',
  visibility: 1,
  tagNames: []
});

// 获取文章详情
const fetchPostDetail = async () => {
  try {
    loading.value = true;
    const response = await postApi.getPostDetail(postId);
    form.title = response.title;
    form.content = response.content;
    form.fileUrl = response.fileUrl || '';
    form.ethnicGroup = response.ethnicGroup || '';
    form.region = response.region || '';
    form.visibility = response.visibility;
    form.tagNames = response.tags || [];
  } catch (error) {
    errorHandler.handleApiError(error);
    router.push('/my-posts');
  } finally {
    loading.value = false;
  }
};

// 处理文件上传
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    submitting.value = true;
    const response = await uploadApi.uploadPostFile(file);
    form.fileUrl = response;
  } catch (error) {
    errorHandler.handleApiError(error);
  } finally {
    submitting.value = false;
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

// 移除标签
const removeTag = (index) => {
  form.tagNames.splice(index, 1);
};

// 提交表单
const handleSubmit = async () => {
  try {
    submitting.value = true;
    await postApi.updatePost(postId, form);
    errorHandler.showError('修改成功');
    router.push('/my-posts');
  } catch (error) {
    errorHandler.handleApiError(error);
  } finally {
    submitting.value = false;
  }
};

// 取消
const cancel = () => {
  if (confirm('确定要取消修改吗？')) {
    router.push('/my-posts');
  }
};

// 组件挂载时获取文章详情
onMounted(() => {
  fetchPostDetail();
});
</script>

<style scoped>
.edit-post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-title {
  color: #d9534f;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d9534f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.edit-post-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.file-upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.file-upload-area:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 32px;
}

.file-preview {
  position: relative;
  margin-top: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.preview-video {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.remove-file-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-file-btn:hover {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.tags-input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.remove-tags-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-tags-btn:hover {
  color: #f56c6c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: linear-gradient(135deg, #409eff, #66b1ff);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
</style>
