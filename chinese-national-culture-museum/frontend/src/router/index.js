import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/MainLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileSettingsView from '@/views/ProfileSettingsView.vue';
import FriendsView from '@/views/FriendsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import MessageView from '@/views/MessageView.vue'; // 新增

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Home', component: HomeView },
            { path: 'profile', name: 'Profile', component: ProfileSettingsView },
            { path: 'profile/:id', name: 'UserProfile', component: () => import('@/views/UserProfile.vue') },
            { path: 'friends', name: 'Friends', component: FriendsView },
            { path: 'message/:friendUsername?', name: 'Message', component: MessageView }, // 新增
            { path: 'post/:id', name: 'PostDetail', component: HomeView }, // 使用HomeView作为占位符，实际通过模态框显示
            { path: 'my-posts', name: 'MyPosts', component: () => import('@/views/MyPostsView.vue') },
            { path: 'edit-post/:id', name: 'EditPost', component: () => import('@/views/EditPostView.vue') },
            { path: 'my-collects', name: 'MyCollects', component: () => import('@/views/MyCollectsView.vue') },
            { path: 'category', name: 'Category', component: () => import('@/views/CategoryView.vue') },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    }
];

export default createRouter({
    history: createWebHistory(),
    routes
});