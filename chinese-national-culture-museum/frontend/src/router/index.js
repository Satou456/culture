import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('@/components/MainLayout.vue'),
        children: [
            { path: '', name: 'Home', component: () => import('@/views/HomeView.vue') },
            { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileSettingsView.vue') },
            { path: 'profile/:id', name: 'UserProfile', component: () => import('@/views/UserProfile.vue') },
            { path: 'friends', name: 'Friends', component: () => import('@/views/FriendsView.vue') },
            { path: 'message/:friendUsername?', name: 'Message', component: () => import('@/views/MessageView.vue') }, // 新增
            { path: 'post/:id', name: 'PostDetail', component: () => import('@/views/HomeView.vue') }, // 使用HomeView作为占位符，实际通过模态框显示
            { path: 'my-posts', name: 'MyPosts', component: () => import('@/views/MyPostsView.vue') },
            { path: 'edit-post/:id', name: 'EditPost', component: () => import('@/views/EditPostView.vue') },
            { path: 'my-collects', name: 'MyCollects', component: () => import('@/views/MyCollectsView.vue') },
            { path: 'category', name: 'Category', component: () => import('@/views/CategoryView.vue') },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/RegisterView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 直接放行，数据加载在组件内部处理
    next();
});

export default router;