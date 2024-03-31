
// 第一步: 引入createRouter
import { createRouter,createWebHistory } from "vue-router";
// import axios from 'axios'
// 引入一个要展示的组件
import Login from "../pages/Login.vue";
import ContentShow from '../pages/ContentShow.vue'
import CreateArticles from '../pages/CreateArticles.vue'
import MyPage from '../pages/MyPage.vue'
import PreviewArticles from '../pages/PreviewArticles.vue'
import ArticlesList from "../pages/ArticlesList.vue";
import EditUserInfo from '../pages/EditUserInfo.vue'
import Management from "@/pages/Management.vue";
// 第二步： 创建路由器
const router = createRouter({
    history:createWebHistory(),// 路由器工作模式
    routes:[
        {
            path:'/:type',
            component:ArticlesList,
            props:true
        },
        {
            path:'/login',
            component:Login
        },
        {
            name:'content',
            path:'/content-show/:articleId',
            // path:'/content-show/:articleId?', 加个 ？ 可配置参数必要性
            component:ContentShow,
        },
        {
            path:'/create-articles',
            component:CreateArticles
        },
        {
            path:'/edit-user-info',
            component:EditUserInfo
        },
        {
            path:'/my-page',
            component:MyPage,
            children:[
               
                {
                    path:'articles',
                    component:PreviewArticles
                },
            ]
        },
        {
            name:'article-list',
            path:'/articles-list/:type',
            component:ArticlesList
        },
        {
            path:'/management',
            component:Management
        }
    ]
})
router.beforeEach((to, from, next) => {
    // const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000; // 三天的毫秒数
    // const expireTime = new Date().getTime() + threeDaysInMilliseconds;
    const expireTime = localStorage.getItem('expireTime');
    const now = new Date().getTime();
    if (now > Number(expireTime)) {
        // 用户信息已过期，清除用户信息
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('expireTime');
    }
    next()
});
// async function checkUserLoggedIn() : Promise<boolean> {
//     console.log('---------')
//     const token = localStorage.getItem('token')
//     try {await axios({
//         method:'post',
//         url:'http://localhost:5173/api/user/checkUserLoggedIn',
//         data:{
//             token:token
//         },
//         headers:{
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     })
//     .then(function (resp) {
//       return resp.data.code === 0
//     })
//     }
//     catch{
//         return false
// } 
// }







// router.beforeEach((to,from,next) => {
//     const isLoginedIn = await checkUserLoggedIn()
    
//     const loginRequiredRoutes = ['/create-articles']

//     if (isLoginedIn && loginRequiredRoutes.includes(to.path)) {
//         next('/login?redirect=' + encodeURIComponent(to.fullPath));
//     }
//     else {
//         next();
//     }
// })
export default router