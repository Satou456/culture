// DOM元素选择
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');

// 当前页面索引
let currentSectionIndex = 0;
// 是否正在滚动
let isScrolling = false;
// 页面数量
const totalSections = sections.length;



// 移动端导航菜单切换
function initMobileNav() {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        // 切换图标
        const isActive = nav.classList.contains('active');
        navToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// 滚动效果
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 平滑滚动到指定页面
function scrollToSection(index) {
    if (isScrolling) return;

    isScrolling = true;

    // 计算目标滚动位置
    const targetPosition = sections[index].offsetTop;

    // 执行直接滚动，无动画
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });

    // 更新当前页面索引
    currentSectionIndex = index;

    // 更新导航链接激活状态
    updateNavActiveState(index);

    // 滚动完成后设置标志为 false
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// 监听页面加载和调整大小，确保页面位置正确
window.addEventListener('load', () => {
    // 初始化页面位置
    window.scrollTo({ top: 0, behavior: 'auto' });
    currentSectionIndex = 0;
    updateNavActiveState(0);
});

window.addEventListener('resize', () => {
    // 调整大小时，确保当前页面位置正确
    if (!isScrolling) {
        window.scrollTo({ top: sections[currentSectionIndex].offsetTop, behavior: 'auto' });
    }
});

// 更新导航链接激活状态
function updateNavActiveState(index) {
    navLinks.forEach((link, i) => {
        if (i === index) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 平滑滚动到锚点
function initSmoothScroll() {
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(index);
        });
    });
}

// 滚动事件处理
function initScrollNavigation() {
    let lastScrollTop = 0;
    const scrollThreshold = 30; // 降低滚动阈值，使翻页更灵敏

    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
        const scrollAmount = Math.abs(e.deltaY);

        // 只有当滚动距离超过阈值时才切换页面
        if (scrollAmount > scrollThreshold) {
            if (scrollDirection === 'down') {
                // 向下滚动，切换到下一页，最后一页继续翻返回第一页
                const nextIndex = (currentSectionIndex + 1) % totalSections;
                scrollToSection(nextIndex);
            } else {
                // 向上滚动，切换到上一页，第一页继续翻返回最后一页
                const prevIndex = (currentSectionIndex - 1 + totalSections) % totalSections;
                scrollToSection(prevIndex);
            }
        }
    });

    // 监听滚动位置，更新当前页面索引
    window.addEventListener('scroll', () => {
        if (isScrolling) return;

        const scrollPosition = window.scrollY;

        // 确定当前可见的页面
        let currentVisibleSection = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= scrollPosition + 100) {
                currentVisibleSection = i;
            }
        }

        // 如果当前可见页面与记录的页面索引不同，更新索引和导航状态
        if (currentVisibleSection !== currentSectionIndex) {
            currentSectionIndex = currentVisibleSection;
            updateNavActiveState(currentSectionIndex);
        }
    });
}

// 滚动动画触发逻辑
function initScrollAnimation() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        // 处理关于我们部分动画
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const aboutTop = aboutSection.offsetTop;
            const aboutHeight = aboutSection.clientHeight;

            if (scrollPosition >= aboutTop && scrollPosition < aboutTop + aboutHeight) {
                // 进入第二页
                aboutSection.classList.add('animate-in');
            }
        }

        // 处理中华民族的历史部分动画
        const historySection = document.querySelector('#history');
        if (historySection) {
            const historyTop = historySection.offsetTop;
            const historyHeight = historySection.clientHeight;

            if (scrollPosition >= historyTop && scrollPosition < historyTop + historyHeight) {
                // 进入第三页
                historySection.classList.add('animate-in');
            }
        }

        // 处理服务部分动画
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            const servicesTop = servicesSection.offsetTop;
            const servicesHeight = servicesSection.clientHeight;

            if (scrollPosition >= servicesTop && scrollPosition < servicesTop + servicesHeight) {
                // 进入第四页
                servicesSection.classList.add('animate-in');
            }
        }

        // 处理论坛部分动画
        const forumSection = document.querySelector('#forum');
        if (forumSection) {
            const forumTop = forumSection.offsetTop;
            const forumHeight = forumSection.clientHeight;

            if (scrollPosition >= forumTop && scrollPosition < forumTop + forumHeight) {
                // 进入第五页
                forumSection.classList.add('animate-in');
            }
        }

        // 处理论坛平台部分动画
        const communitySection = document.querySelector('#community');
        if (communitySection) {
            const communityTop = communitySection.offsetTop;
            const communityHeight = communitySection.clientHeight;

            if (scrollPosition >= communityTop && scrollPosition < communityTop + communityHeight) {
                // 进入第六页
                communitySection.classList.add('animate-in');
            }
        }
    });
}

// 按键事件处理
function initKeyNavigation() {
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // 空格键
                e.preventDefault();
                // 向下滚动，切换到下一页，最后一页继续翻返回第一页
                const nextIndex = (currentSectionIndex + 1) % totalSections;
                scrollToSection(nextIndex);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                // 向上滚动，切换到上一页，第一页继续翻返回最后一页
                const prevIndex = (currentSectionIndex - 1 + totalSections) % totalSections;
                scrollToSection(prevIndex);
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(totalSections - 1);
                break;
        }
    });
}

// 响应式处理
function initResponsive() {
    function handleResize() {
        if (window.innerWidth > 768) {
            nav.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调用
}

// 轮播照片功能
function initCarousel() {
    const carousel = document.querySelector('#about .carousel');
    if (!carousel) return;

    const carouselItems = carousel.querySelectorAll('.carousel-item');
    let currentItem = 0;

    // 切换轮播项
    function switchCarouselItem(newIndex) {
        if (newIndex >= 0 && newIndex < carouselItems.length) {
            carouselItems[currentItem].classList.remove('active');
            carouselItems[newIndex].classList.add('active');
            currentItem = newIndex;
        }
    }

    // 自动切换轮播
    function autoSwitchCarousel() {
        const nextIndex = (currentItem + 1) % carouselItems.length;
        switchCarouselItem(nextIndex);
    }

    // 设置自动切换定时器
    setInterval(autoSwitchCarousel, 5000);
}

// 历史时间轴交互功能
function initTimelineInteraction() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const historyItems = document.querySelectorAll('.history-item');
    const viewDetailsPoint = document.getElementById('viewDetails');

    timelinePoints.forEach(point => {
        point.addEventListener('click', function () {
            const period = this.getAttribute('data-period');

            // 移除所有时间点的活跃状态
            timelinePoints.forEach(p => p.classList.remove('active'));
            // 添加当前时间点的活跃状态
            this.classList.add('active');

            // 隐藏所有历史内容
            historyItems.forEach(item => item.classList.remove('active'));
            // 显示对应历史内容
            const targetItem = document.querySelector(`.history-item[data-period="${period}"]`);
            if (targetItem) {
                targetItem.classList.add('active');
            }
        });
    });

    // 为"查看详细信息"添加点击事件
    if (viewDetailsPoint) {
        viewDetailsPoint.addEventListener('click', function () {
            // 直接跳转到详细历史信息页面
            window.location.href = './history/index.html';
        });
    }
}

// 初始化所有功能
function init() {
    initMobileNav();
    initScrollEffects();
    initSmoothScroll();
    initScrollNavigation();
    initKeyNavigation();
    initResponsive();
    initCarousel();
    initScrollAnimation();
    initTimelineInteraction();

    // 初始化导航链接激活状态
    updateNavActiveState(0);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// 视频切换功能
function initVideoSwitcher() {
    const videoItems = document.querySelectorAll('.video-item');
    const coverflowItems = document.querySelectorAll('.coverflow-item');
    const titleElement = document.querySelector('#home h2');
    const descriptionElement = document.querySelector('#home p');
    let currentIndex = 0;
    let videoData = [];

    // 加载视频数据
    async function loadVideoData() {
        try {
            const response = await fetch('video_data.json');
            videoData = await response.json();
            console.log('视频数据加载成功:', videoData);

            // 更新缩略图
            updateThumbnails();
            // 更新视频URL
            updateVideoUrls();
        } catch (error) {
            console.error('加载视频数据失败:', error);
        }
    }

    // 更新缩略图
    function updateThumbnails() {
        coverflowItems.forEach((item, index) => {
            if (videoData[index]) {
                const imgElement = item.querySelector('img');
                if (imgElement) {
                    imgElement.src = videoData[index].thumbnailUrl;
                    imgElement.alt = videoData[index].title;
                }
            }
        });
    }

    // 更新视频URL
    function updateVideoUrls() {
        videoItems.forEach((item, index) => {
            if (videoData[index]) {
                const videoElement = item.querySelector('video');
                if (videoElement) {
                    const sourceElement = videoElement.querySelector('source');
                    if (sourceElement) {
                        sourceElement.src = videoData[index].videoUrl;
                    }
                }
            }
        });
    }

    // 更新标题和描述
    function updateTitleAndDescription(index) {
        if (videoData[index]) {
            titleElement.textContent = videoData[index].title;
            descriptionElement.textContent = videoData[index].description;
        }
    }

    // 切换视频函数
    function switchVideo(newIndex) {
        if (newIndex === currentIndex) return;

        // 暂停当前视频
        const currentVideo = videoItems[currentIndex].querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }

        // 更新控制按钮状态
        coverflowItems[currentIndex].classList.remove('active');
        coverflowItems[newIndex].classList.add('active');

        // 隐藏当前视频
        videoItems[currentIndex].classList.remove('active');

        // 显示新视频
        videoItems[newIndex].classList.add('active');

        // 播放新视频
        const newVideo = videoItems[newIndex].querySelector('video');
        if (newVideo) {
            newVideo.play().catch(err => {
                console.error('视频播放失败:', err);
            });
        }

        // 更新标题和描述
        updateTitleAndDescription(newIndex);

        // 更新当前索引
        currentIndex = newIndex;
    }

    // 控制按钮点击事件
    coverflowItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            switchVideo(index);
        });
    });

    // 键盘事件监听
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                // 向左切换
                const prevIndex = (currentIndex - 1 + videoItems.length) % videoItems.length;
                switchVideo(prevIndex);
                break;
            case 'ArrowRight':
                // 向右切换
                const nextIndex = (currentIndex + 1) % videoItems.length;
                switchVideo(nextIndex);
                break;
        }
    });

    // 添加锁定状态变量
    let isLocked = false;

    // 创建锁定按钮
    function createLockButton() {
        const videoControls = document.querySelector('.video-controls');
        if (!videoControls) return;

        // 获取最后一个缩略图元素
        const coverflowItems = document.querySelectorAll('.coverflow-item');
        const lastThumbnail = coverflowItems[coverflowItems.length - 1];

        const lockButton = document.createElement('button');
        lockButton.id = 'lockButton';
        lockButton.className = 'lock-btn';
        lockButton.innerHTML = '<i class="fas fa-lock-open"></i> 解锁';

        // 设置初始样式
        lockButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 10px;
            padding: 10px 20px;
            background: linear-gradient(135deg, rgba(0, 242, 241, 0.2), rgba(0, 150, 148, 0.3));
            border: 1px solid rgba(0, 242, 241, 0.5);
            border-radius: 25px;
            color: #00f2f1;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0, 242, 241, 0.3);
            backdrop-filter: blur(5px);
        `;

        // 添加到DOM
        videoControls.appendChild(lockButton);

        // 计算并设置按钮位置
        function setLockButtonPosition() {
            try {
                if (lastThumbnail) {
                    // 获取最后一个缩略图的位置和尺寸（相对于文档）
                    const lastThumbnailRect = lastThumbnail.getBoundingClientRect();

                    // 获取video-controls的位置（相对于文档）
                    const videoControlsRect = videoControls.getBoundingClientRect();

                    // 计算最后一个缩略图右侧相对于video-controls容器的位置
                    const lastThumbnailRight = lastThumbnailRect.right - videoControlsRect.left;

                    // 计算按钮的左侧位置（相对于video-controls）
                    const buttonLeft = lastThumbnailRight + 40; // 增加间距到40px

                    // 设置按钮位置
                    lockButton.style.left = buttonLeft + 'px';
                    lockButton.style.right = 'auto'; // 重置right属性

                    console.log('锁定按钮位置计算:', {
                        lastThumbnailRight,
                        buttonLeft,
                        videoControlsWidth: videoControlsRect.width
                    });
                } else {
                    // 如果没有缩略图，直接设置一个靠右的位置
                    lockButton.style.right = '20px';
                    lockButton.style.left = 'auto';
                    console.log('没有缩略图，使用默认右侧位置');
                }
            } catch (error) {
                console.error('计算锁定按钮位置时出错:', error);
                // 出错时使用默认位置
                lockButton.style.right = '20px';
                lockButton.style.left = 'auto';
            }
        }

        // 初始化位置
        setLockButtonPosition();

        // 窗口大小改变时重新计算位置
        window.addEventListener('resize', setLockButtonPosition);

        // 视频数据加载完成后重新计算位置
        setTimeout(setLockButtonPosition, 1000);

        // 添加鼠标悬停效果
        lockButton.addEventListener('mouseenter', () => {
            lockButton.style.background = 'linear-gradient(135deg, rgba(0, 242, 241, 0.3), rgba(0, 150, 148, 0.4))';
            lockButton.style.borderColor = 'rgba(0, 242, 241, 0.8)';
            lockButton.style.boxShadow = '0 4px 15px rgba(0, 242, 241, 0.5)';
            lockButton.style.transform = 'translateY(-2px)';
        });

        lockButton.addEventListener('mouseleave', () => {
            lockButton.style.background = 'linear-gradient(135deg, rgba(0, 242, 241, 0.2), rgba(0, 150, 148, 0.3))';
            lockButton.style.borderColor = 'rgba(0, 242, 241, 0.5)';
            lockButton.style.boxShadow = '0 2px 10px rgba(0, 242, 241, 0.3)';
            lockButton.style.transform = 'translateY(0)';
        });

        // 添加点击事件
        lockButton.addEventListener('click', () => {
            isLocked = !isLocked;
            if (isLocked) {
                lockButton.innerHTML = '<i class="fas fa-lock"></i> 锁定';
                lockButton.style.background = 'linear-gradient(135deg, rgba(242, 0, 0, 0.2), rgba(150, 0, 0, 0.3))';
                lockButton.style.borderColor = 'rgba(242, 0, 0, 0.5)';
                lockButton.style.boxShadow = '0 2px 10px rgba(242, 0, 0, 0.3)';
                lockButton.style.color = '#ff4757';
                clearInterval(autoSwitchTimer);
            } else {
                lockButton.innerHTML = '<i class="fas fa-lock-open"></i> 解锁';
                lockButton.style.background = 'linear-gradient(135deg, rgba(0, 242, 241, 0.2), rgba(0, 150, 148, 0.3))';
                lockButton.style.borderColor = 'rgba(0, 242, 241, 0.5)';
                lockButton.style.boxShadow = '0 2px 10px rgba(0, 242, 241, 0.3)';
                lockButton.style.color = '#00f2f1';
                autoSwitchTimer = setInterval(autoSwitchVideo, 8000);
            }
        });
    }

    // 自动切换视频
    function autoSwitchVideo() {
        if (isLocked) return; // 锁定时不自动切换
        const nextIndex = (currentIndex + 1) % videoItems.length;
        switchVideo(nextIndex);
    }

    // 设置自动切换定时器
    let autoSwitchTimer = setInterval(autoSwitchVideo, 8000);

    // 鼠标悬停时暂停自动切换
    const videoContainer = document.querySelector('.video-switcher');
    videoContainer.addEventListener('mouseenter', () => {
        if (!isLocked) {
            clearInterval(autoSwitchTimer);
        }
    });

    // 鼠标离开时恢复自动切换
    videoContainer.addEventListener('mouseleave', () => {
        if (!isLocked) {
            autoSwitchTimer = setInterval(autoSwitchVideo, 8000);
        }
    });

    // 创建锁定按钮
    createLockButton();

    // 初始化
    loadVideoData().then(() => {
        // 初始更新标题和描述
        updateTitleAndDescription(0);

        // 播放第一个视频
        const firstVideo = videoItems[0].querySelector('video');
        if (firstVideo) {
            firstVideo.play().catch(err => {
                console.error('视频播放失败:', err);
            });
        }
    });

    // 页面焦点管理：当页面失去焦点时暂停视频，获得焦点时恢复播放
    function initVideoFocusManagement() {
        const videos = document.querySelectorAll('.video-item video');

        // 页面失去焦点时暂停所有视频
        window.addEventListener('blur', () => {
            videos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                }
            });
        });

        // 页面获得焦点时恢复当前活动视频的播放
        window.addEventListener('focus', () => {
            const activeVideo = document.querySelector('.video-item.active video');
            if (activeVideo && activeVideo.paused) {
                activeVideo.play();
            }
        });
    }

    // 初始化视频焦点管理
    initVideoFocusManagement();
}

// 窗口加载完成后执行
window.addEventListener('load', () => {
    // 可以添加需要在所有资源加载完成后执行的代码
    console.log('中华民族文化馆页面加载完成');
    // 初始化视频切换功能
    initVideoSwitcher();
});

// 蓝图按钮跳转到文化概览页
// 已修改为直接链接跳转，无需弹窗功能

// 56个民族弹窗功能
function initEthnicGroupsModal() {
    const ethnicGroupsBtn = document.getElementById('ethnicGroupsBtn');
    const ethnicGroupsModal = document.getElementById('ethnicGroupsModal');
    const closeEthnicGroupsModal = document.getElementById('closeEthnicGroupsModal');
    const ethnicGroupsContainer = document.getElementById('ethnicGroupsContainer');
    const ethnicDetailModal = document.getElementById('ethnicDetailModal');
    const closeEthnicDetailModal = document.getElementById('closeEthnicDetailModal');
    const ethnicDetailTitle = document.getElementById('ethnicDetailTitle');
    const ethnicDetailContent = document.getElementById('ethnicDetailContent');
    let ethnicGroupsData = [];

    // 56个民族列表
    const ethnicNames = [
        '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族',
        '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族',
        '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族',
        '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族',
        '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族',
        '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
    ];

    // 民族名称中英文映射
    const ethnicMap = {
        '汉族': 'han',
        '蒙古族': 'mongolian',
        '回族': 'hui',
        '藏族': 'tibetan',
        '维吾尔族': 'uyghur',
        '苗族': 'miao',
        '彝族': 'yi',
        '壮族': 'zhuang',
        '布依族': 'buyi',
        '朝鲜族': 'korean',
        '满族': 'manchu',
        '侗族': 'dong',
        '瑶族': 'yao',
        '白族': 'bai',
        '土家族': 'tujia',
        '哈尼族': 'hani',
        '哈萨克族': 'kazakh',
        '傣族': 'dai',
        '黎族': 'li',
        '傈僳族': 'lisu',
        '佤族': 'wa',
        '畲族': 'she',
        '高山族': 'gaoshan',
        '拉祜族': 'lahu',
        '水族': 'shui',
        '东乡族': 'dongxiang',
        '纳西族': 'naxi',
        '景颇族': 'jingpo',
        '柯尔克孜族': 'kirgiz',
        '土族': 'tu',
        '达斡尔族': 'daur',
        '仫佬族': 'mulao',
        '羌族': 'qiang',
        '布朗族': 'blang',
        '撒拉族': 'salar',
        '毛南族': 'maonan',
        '仡佬族': 'gelao',
        '锡伯族': 'xibe',
        '阿昌族': 'achang',
        '普米族': 'pumi',
        '塔吉克族': 'tajik',
        '怒族': 'nu',
        '乌孜别克族': 'uzbek',
        '俄罗斯族': 'russian',
        '鄂温克族': 'evenk',
        '德昂族': 'deang',
        '保安族': 'bonan',
        '裕固族': 'yugur',
        '京族': 'jing',
        '塔塔尔族': 'tatar',
        '独龙族': 'drung',
        '鄂伦春族': 'orochen',
        '赫哲族': 'hezhe',
        '门巴族': 'monba',
        '珞巴族': 'luoba',
        '基诺族': 'jino'
    };

    // 加载民族数据
    async function loadEthnicGroupsData() {
        try {
            // 从民族列表创建数据
            ethnicGroupsData = ethnicNames.map(name => {
                // 处理特殊情况：柯尔克孜族对应克尔克孜族.webp文件，乌孜别克族对应乌兹别克族.webp文件
                let fileName = name;
                if (name === '柯尔克孜族') {
                    fileName = '克尔克孜族';
                } else if (name === '乌孜别克族') {
                    fileName = '乌兹别克族';
                }
                return {
                    name: name,
                    image: `data_mz/image/${fileName}.webp`
                };
            });
            console.log('民族数据加载成功:', ethnicGroupsData);
            renderEthnicGroups();
        } catch (error) {
            console.error('加载民族数据失败:', error);
        }
    }

    // 渲染民族卡片
    function renderEthnicGroups() {
        ethnicGroupsContainer.innerHTML = '';
        ethnicGroupsData.forEach(group => {
            const card = document.createElement('div');
            card.className = 'ethnic-group-card';
            card.innerHTML = `
                <img src="${group.image}" alt="${group.name}">
                <h4>${group.name}</h4>
            `;
            card.addEventListener('click', () => {
                showEthnicDetail(group);
            });
            ethnicGroupsContainer.appendChild(card);
        });
    }

    // 加载民族详情文件
    async function loadEthnicFile(ethnicName, fileName) {
        try {
            // 使用映射表将中文民族名称转换为英文目录名
            const englishName = ethnicMap[ethnicName] || ethnicName;
            const response = await fetch(`data_mz/${englishName}/${fileName}.txt`);
            if (!response.ok) {
                throw new Error(`无法加载文件: ${fileName}`);
            }
            const content = await response.text();
            return content.trim();
        } catch (error) {
            console.error(`加载${ethnicName}的${fileName}失败:`, error);
            return '暂无数据';
        }
    }

    // 显示民族详情
    async function showEthnicDetail(group) {
        ethnicDetailTitle.textContent = group.name;

        // 处理特殊情况：柯尔克孜族对应克尔克孜族.webp文件，乌孜别克族对应乌兹别克族.webp文件
        let fileName = group.name;
        if (group.name === '柯尔克孜族') {
            fileName = '克尔克孜族';
        } else if (group.name === '乌孜别克族') {
            fileName = '乌兹别克族';
        }

        // 加载民族详情文件
        const basicInfo = await loadEthnicFile(group.name, '基本信息');
        const history = await loadEthnicFile(group.name, '历史沿革');
        const development = await loadEthnicFile(group.name, '发展状况');
        const customs = await loadEthnicFile(group.name, '风俗习惯');

        ethnicDetailContent.innerHTML = `
            <img src="data_mz/image/${fileName}.webp" alt="${group.name}">
            <div class="ethnic-detail-info">
                <div>
                    <h4>基本信息</h4>
                    <p>${basicInfo}</p>
                </div>
                <div>
                    <h4>历史沿革</h4>
                    <p>${history}</p>
                </div>
                <div>
                    <h4>发展状况</h4>
                    <p>${development}</p>
                </div>
                <div>
                    <h4>风俗习惯</h4>
                    <p>${customs}</p>
                </div>
            </div>
        `;
        ethnicDetailModal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    // 打开民族弹窗
    if (ethnicGroupsBtn) {
        ethnicGroupsBtn.addEventListener('click', () => {
            ethnicGroupsModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    }

    // 关闭民族弹窗
    if (closeEthnicGroupsModal) {
        closeEthnicGroupsModal.addEventListener('click', () => {
            ethnicGroupsModal.classList.add('fade-out');
            setTimeout(() => {
                ethnicGroupsModal.style.display = 'none';
                ethnicGroupsModal.classList.remove('fade-out');
                document.body.classList.remove('modal-open');
            }, 300);
        });
    }

    // 关闭民族详情弹窗
    if (closeEthnicDetailModal) {
        closeEthnicDetailModal.addEventListener('click', () => {
            ethnicDetailModal.classList.add('fade-out');
            setTimeout(() => {
                ethnicDetailModal.style.display = 'none';
                ethnicDetailModal.classList.remove('fade-out');
                document.body.classList.remove('modal-open');
            }, 300);
        });
    }

    // 点击弹窗外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === ethnicGroupsModal) {
            ethnicGroupsModal.classList.add('fade-out');
            setTimeout(() => {
                ethnicGroupsModal.style.display = 'none';
                ethnicGroupsModal.classList.remove('fade-out');
                document.body.classList.remove('modal-open');
            }, 300);
        }
        if (e.target === ethnicDetailModal) {
            ethnicDetailModal.classList.add('fade-out');
            setTimeout(() => {
                ethnicDetailModal.style.display = 'none';
                ethnicDetailModal.classList.remove('fade-out');
                document.body.classList.remove('modal-open');
            }, 300);
        }
    });

    // 初始化加载数据
    loadEthnicGroupsData();
}

// 中国地图初始化代码
function initChinaMap() {
    // 初始化服务部分的地图
    const chinaMapElement = document.getElementById('chinaMap');
    if (chinaMapElement) {
        initMapInstance(chinaMapElement);
    }
}

// 初始化地图实例
function initMapInstance(element) {
    if (!element) return;

    // 初始化ECharts实例
    const mapChart = echarts.init(element);

    // 设置地图数据
    const mapOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        series: [
            {
                name: '中国',
                type: 'map',
                map: 'china',
                roam: true,
                label: {
                    show: true,
                    color: '#ffffff', // 文字为白色
                    fontSize: 12
                },
                itemStyle: {
                    areaColor: '#e74c3c', // 中国红
                    borderColor: '#c0392b',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        show: true,
                        color: '#ffffff',
                        fontSize: 14
                    },
                    itemStyle: {
                        areaColor: '#c0392b',
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 应用配置
    mapChart.setOption(mapOption);

    // 响应式调整
    window.addEventListener('resize', () => {
        mapChart.resize();
    });
}

// 错误处理
try {
    init();
    // 初始化民族弹窗功能
    initEthnicGroupsModal();
    // 初始化中国地图
    initChinaMap();
} catch (error) {
    console.error('初始化过程中出错:', error);
}