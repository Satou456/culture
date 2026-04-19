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
                <el-select
                  v-model="userInfo.province"
                  placeholder="请选择省份"
                  filterable
                  allow-create
                  style="width: 100%"
                  class="info-select"
                  @change="handleProvinceChange"
                >
                  <el-option
                    v-for="province in provinceSelectOptions"
                    :key="province"
                    :label="province"
                    :value="province"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市">
                <el-select
                  v-model="userInfo.city"
                  placeholder="请选择城市"
                  filterable
                  allow-create
                  style="width: 100%"
                  class="info-select"
                  :disabled="!userInfo.province"
                >
                  <el-option
                    v-for="city in citySelectOptions"
                    :key="city"
                    :label="city"
                    :value="city"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="兴趣标签">
                <el-select
                  v-model="selectedInterestTags"
                  multiple
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择兴趣标签"
                  style="width: 100%"
                  class="info-select"
                  :loading="loadingInterestingTags"
                  no-data-text="暂无兴趣标签"
                >
                  <el-option
                    v-for="tag in interestingTagOptions"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
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
import { ref, reactive, onMounted, onActivated, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { userApi } from '@/api/user';
import { tagApi } from '@/api/tag';

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
const selectedInterestTags = ref([]);
const interestingTagOptions = ref([]);
const loadingInterestingTags = ref(false);

const provinceCityMap = {
  '北京市': ['北京市'],
  '天津市': ['天津市'],
  '上海市': ['上海市'],
  '重庆市': ['重庆市'],
  '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
  '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  '内蒙古自治区': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
  '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '济源市'],
  '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '仙桃市', '潜江市', '天门市', '神农架林区'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
  '广东省': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '海南省': ['海口市', '三亚市', '三沙市', '儋州市'],
  '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
  '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
  '西藏自治区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区'],
  '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
  '青海省': ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
  '宁夏回族自治区': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  '新疆维吾尔自治区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区'],
  '台湾省': ['台北市', '新北市', '桃园市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉义市'],
  '香港特别行政区': ['香港'],
  '澳门特别行政区': ['澳门']
};

const provinceOptions = Object.keys(provinceCityMap);

const provinceSelectOptions = computed(() => {
  if (userInfo.province && !provinceOptions.includes(userInfo.province)) {
    return [userInfo.province, ...provinceOptions];
  }
  return provinceOptions;
});

const citySelectOptions = computed(() => {
  const cities = provinceCityMap[userInfo.province] || [];
  if (userInfo.city && !cities.includes(userInfo.city)) {
    return [userInfo.city, ...cities];
  }
  return cities;
});

// 民族列表
const ethnicGroups = [
  '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族',
  '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族',
  '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
  '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族',
  '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族',
  '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
];

const normalizeInterestingTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => {
      if (typeof tag === 'string') {
        return tag;
      }
      return tag?.name || tag?.tagName || tag?.tag_name || tag?.label || tag?.value || '';
    })
    .filter(Boolean);
};

const loadInterestingTags = async () => {
  loadingInterestingTags.value = true;
  try {
    const tags = await tagApi.getInterestingTags();
    interestingTagOptions.value = normalizeInterestingTags(tags);
  } catch (error) {
    console.error('获取兴趣标签失败:', error);
    ElMessage.error('获取兴趣标签失败，请检查网络连接');
  } finally {
    loadingInterestingTags.value = false;
  }
};

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
        selectedInterestTags.value = [...userData.interestTags];
      } else {
        selectedInterestTags.value = [];
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
    userInfo.interestTags = [...selectedInterestTags.value];
    
    await userApi.updateUserInfo(userInfo);
    ElMessage.success('保存成功');
  } catch (error) {
    console.error('保存用户信息失败:', error);
    ElMessage.error(error.message || '保存失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};

const handleProvinceChange = () => {
  if (userInfo.city && !citySelectOptions.value.includes(userInfo.city)) {
    userInfo.city = '';
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
  loadInterestingTags();
});

// 每次激活组件时重新获取数据
onActivated(() => {
  // 清除用户信息缓存，确保获取最新数据
  import('@/api/request').then(({ default: request }) => {
    request.clearCache('/user');
    loadUserProfile();
    loadInterestingTags();
  });
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