// 引入createApp用于创建应用
import { createApp } from 'vue'
// 引入App根组件
import App from './App.vue'
// 引入路由器
import router from './router'
// 引入pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
import axios from "axios"

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// const whiteList = ['/publicInterface1', '/publicInterface2']; // 允许未登录用户访问的接口
// axios.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401: // 未登录
//                     if (!whiteList.includes(error.config.url)) {
//                         // 若不在白名单中
//                         router.push({
//                             path:'/login'
//                         }).catch(() => {});
//                     }
//                     break;
//                 case 403: // 无权限
//                     alert('您没有权限进行此操作！');
//                     break;
//                 // 其他错误处理
//                 default:
//                     // 提示用户发生错误
//                     alert('发生错误：' + error.response.status);
//                     console.log(error);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// 创建一个应用
const app = createApp(App)
// 使用路由器
app.use(router)
// 使用pinia
app.use(pinia)

// 挂在整个应用到app容器中
app.mount('#app')

