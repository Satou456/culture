<template>
  <div class="profile-page">
    <!-- 顶部横幅 -->
    <div class="banner" :style="bannerStyle">
      <button class="banner-edit-btn" @click="bannerInput.click()">修改横幅</button>
      <input type="file" ref="bannerInput" accept="image/*" style="display: none;" @change="handleBannerUpload">
    </div>

    <!-- 个人信息区域 -->
    <div class="profile-container">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <el-avatar :size="120" :src="userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.username}`">
          {{ userInfo.username.charAt(0).toUpperCase() }}
        </el-avatar>
        <div class="avatar-actions">
          <el-button class="avatar-edit-btn" @click="avatarInput.click()">修改头像</el-button>
          <input type="file" ref="avatarInput" accept="image/*" style="display: none;" @change="handleAvatarUpload">
        </div>
      </div>

      <!-- 个人信息表单 -->
      <el-card class="info-card">
        <el-form @submit.prevent="saveProfile" :model="userInfo" label-width="80px">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nickname" placeholder="请输入昵称" class="info-input"></el-input>
          </el-form-item>

          <el-form-item label="个人简介">
            <el-input v-model="userInfo.bio" placeholder="请输入个人简介" type="textarea" :rows="4" class="bio-input"></el-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号">
                <el-input v-model="userInfo.mobile" placeholder="请输入手机号" class="info-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" type="email" placeholder="请输入邮箱" class="info-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族">
                <el-select v-model="userInfo.ethnicGroup" placeholder="请选择民族" style="width: 100%" class="info-select">
                  <el-option v-for="ethnic in ethnicGroups" :key="ethnic" :label="ethnic" :value="ethnic"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份">
                <el-input v-model="userInfo.province" placeholder="请输入省份" class="info-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市">
                <el-input v-model="userInfo.city" placeholder="请输入城市" class="info-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="兴趣标签">
                <el-input v-model="interestTagsInput" placeholder="请输入兴趣标签，用逗号分隔" class="info-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button class="red-btn" @click="saveProfile" :loading="loading">
              <span v-if="loading">保存中...</span>
              <span v-else>保存修改</span>
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 账号安全卡片 -->
      <el-card class="security-card">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">账号安全</h2>
          </div>
        </template>
        <div class="security-section">
          <div class="security-item">
            <div class="security-info">
              <h3 class="security-title">修改密码</h3>
              <p class="security-desc">定期修改密码可以提高账号安全性</p>
            </div>
            <el-button class="red-btn" @click="showChangePasswordModal = true">
              <span class="icon">🔒</span>
              <span>修改密码</span>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showChangePasswordModal" title="修改密码" width="400px">
      <el-form @submit.prevent="changePassword" :model="passwordForm" label-width="100px">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmNewPassword" type="password" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <div class="dialog-footer">
          <el-button class="red-btn-outline" @click="showChangePasswordModal = false">取消</el-button>
          <el-button class="red-btn" @click="changePassword" :loading="passwordLoading">
            <span v-if="passwordLoading">保存中...</span>
            <span v-else>保存修改</span>
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userApi } from '@/api/user';

const router = useRouter();
const avatarInput = ref(null);
const bannerInput = ref(null);

// 加载状态
const loading = ref(false);

// 密码修改状态
const showChangePasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

// 用户信息
const userInfo = reactive({
  username: '',
  nickname: '',
  avatar: '',
  banner: '',
  email: '',
  mobile: '',
  bio: '',
  ethnicGroup: '',
  province: '',
  city: '',
  interestTags: []
});

// 横幅背景样式
const bannerStyle = computed(() => {
  if (userInfo.banner) {
    return {
      backgroundImage: `url(${userInfo.banner})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }
  return {
    backgroundColor: '#e8f0fe'
  };
});

// 兴趣标签输入
const interestTagsInput = ref('');

// 民族列表
const ethnicGroups = [
  '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族',
  '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族',
  '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
  '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族',
  '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族',
  '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
];

// 加载用户信息
const loadUserProfile = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    router.push('/login');
    return;
  }
  
  try {
    const userData = await userApi.getUserInfo(userId);
    console.log('User data:', userData);
    if (userData) {
      Object.assign(userInfo, userData);
      // 处理兴趣标签
      if (userData.interestTags && Array.isArray(userData.interestTags)) {
        interestTagsInput.value = userData.interestTags.join(', ');
      }
      // 保存头像到本地存储
      if (userData.avatar) {
        localStorage.setItem('userAvatar', userData.avatar);
        // 触发头像更新事件
        window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: userData.avatar } }));
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败，请检查网络连接');
  }
};

// 保存用户信息
const saveProfile = async () => {
  loading.value = true;
  
  try {
    // 处理兴趣标签
    if (interestTagsInput.value) {
      userInfo.interestTags = interestTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
      userInfo.interestTags = [];
    }
    
    await userApi.updateUserInfo(userInfo);
    ElMessage.success('保存成功');
  } catch (error) {
    console.error('保存用户信息失败:', error);
    ElMessage.error(error.message || '保存失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

// 处理头像上传
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  try {
    const avatarUrl = await userApi.uploadAvatar(file);
    console.log('Avatar URL:', avatarUrl);
    if (avatarUrl) {
      userInfo.avatar = avatarUrl;
      // 保存到本地存储
      localStorage.setItem('userAvatar', avatarUrl);
      // 触发头像更新事件，通知其他组件
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: avatarUrl } }));
      ElMessage.success('头像上传成功');
    }
  } catch (error) {
    console.error('头像上传失败:', error);
    ElMessage.error(error.message || '头像上传失败，请检查网络连接');
  } finally {
    loading.value = false;
    // 清空文件输入，以便可以重复选择同一个文件
    if (avatarInput.value) {
      avatarInput.value.value = '';
    }
  }
};

// 处理横幅上传
const handleBannerUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  try {
    const bannerUrl = await userApi.uploadBanner(file);
    console.log('Banner URL:', bannerUrl);
    if (bannerUrl) {
      userInfo.banner = bannerUrl;
      ElMessage.success('横幅上传成功');
    }
  } catch (error) {
    console.error('横幅上传失败:', error);
    ElMessage.error(error.message || '横幅上传失败，请检查网络连接');
  } finally {
    loading.value = false;
    // 清空文件输入
    if (bannerInput.value) {
      bannerInput.value.value = '';
    }
  }
};

// 修改密码
const changePassword = async () => {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
    ElMessage.warning('请填写所有密码字段');
    return;
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    ElMessage.warning('两次输入的密码不一致');
    return;
  }
  
  passwordLoading.value = true;
  
  try {
    // 这里需要根据实际接口实现
    // 假设接口为 /user/change-password
    await userApi.changePassword(passwordForm);
    ElMessage.success('密码修改成功');
    // 关闭弹窗
    setTimeout(() => {
      showChangePasswordModal.value = false;
      // 重置表单
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmNewPassword = '';
    }, 1500);
  } catch (error) {
    console.error('修改密码失败:', error);
    ElMessage.error(error.message || '修改密码失败，请检查网络连接');
  } finally {
    passwordLoading.value = false;
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
.profile-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 隐藏滚动条 */
.profile-page::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.profile-page {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

/* 隐藏所有子元素的滚动条 */
.profile-page *::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.profile-page * {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

/* 顶部横幅 */
.banner {
  width: calc(100% - 40px);
  height: 200px;
  background-color: #e8f0fe;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;
  margin: 20px auto 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  z-index: 10;
}

.banner-edit-btn {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.banner-edit-btn:hover {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 个人信息容器 */
.profile-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  top: -60px;
}

/* 头像区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 20;
}

.avatar-section .el-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-bottom: 15px;
}

.avatar-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.avatar-edit-btn {
  background-color: #f44336;
  border-color: #f44336;
  color: #fff;
}

.avatar-edit-btn:hover {
  background-color: #d32f2f;
  border-color: #d32f2f;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 20px;
  border: none !important;
}

.info-card :deep(.el-card) {
  border: none !important;
}

.info-card :deep(.el-card__body) {
  padding: 0;
  border: none !important;
}

.info-input,
.bio-input,
.info-select {
  border-radius: 8px;
}



.save-btn {
  margin-top: 10px;
  border-radius: 8px;
}



/* 账号安全卡片 */
.security-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: none !important;
}

.security-card :deep(.el-card) {
  border: none !important;
}

.security-card :deep(.el-card__body) {
  padding: 0;
  border: none !important;
}

.security-card :deep(.el-card__header) {
  border: none !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: none;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.security-section {
  padding: 24px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
  border: none;
}

.security-item:last-child {
  margin-bottom: 0;
}

.security-info {
  flex: 1;
}

.security-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 14px;
  color: #606266;
}

.security-item .el-button {
  border-radius: 8px;
}

/* 红色按钮样式 */
.red-btn {
  background-color: #f44336;
  border-color: #f44336;
  color: #fff;
}

.red-btn:hover {
  background-color: #d32f2f;
  border-color: #d32f2f;
  color: #fff;
}

.red-btn-outline {
  background-color: transparent;
  border-color: #f44336;
  color: #f44336;
}

.red-btn-outline:hover {
  background-color: #f44336;
  border-color: #f44336;
  color: #fff;
}

/* 弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner {
    height: 150px;
  }

  .profile-container {
    top: -50px;
    padding: 0 16px;
  }

  .avatar-section .el-avatar {
    width: 100px !important;
    height: 100px !important;
  }

  .avatar-actions {
    flex-direction: column;
    align-items: center;
  }

  .avatar-actions .el-button {
    width: 120px;
  }

  .info-card,
  .security-card {
    padding: 16px;
    border: none !important;
  }

  .info-card :deep(.el-card),
  .security-card :deep(.el-card) {
    border: none !important;
  }

  .info-card :deep(.el-card__body),
  .security-card :deep(.el-card__body) {
    padding: 0;
    border: none !important;
  }

  .security-card :deep(.el-card__header) {
    border: none !important;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .security-item .el-button {
    align-self: flex-end;
  }
}
</style>