<script setup lang="ts">
    import { NBreadcrumb,NIcon,NBreadcrumbItem,NInput,NModal,NCard,NFlex,NDropdown, useMessage,NAvatar } from 'naive-ui';
    import {
        MdCreate,MdSearch,IosLogOut,IosLogIn
    } from '@vicons/ionicons4'
    import {
      UserProfile,UserAvatar,Pen,TaskTools
    } from "@vicons/carbon"
    import {ref,h} from 'vue'
    import type { Component } from 'vue';
    import {useRouter} from 'vue-router'
    const router = useRouter()
     // 导入SideContent.ts中的 useSideContent 变量
    import {useHeadContentStore} from "@/store/HeadContent.ts";
    import {useIPStore} from "@/store/IPStore.ts";
    import axios from 'axios'

    const headContentStore = useHeadContentStore()
    const ip = useIPStore()
    const user = ref(JSON.parse(localStorage.getItem('user')))
    // console.log(user.value)

    function management() {
      router.push({
        path:'/management'
      })

    }


    const keyword = ref('')
    function searchArticle(keyword:string) {
      headContentStore.searchArticle(keyword)
    }

    // const baseURL = 'http://localhost:5173/api'

    const showModalRef = ref(false)
    const timeoutRef = ref(4000)

    const countdown = () => {
      if (timeoutRef.value <= 0) {
        showModalRef.value = false
      } else {
        timeoutRef.value -= 1000
        setTimeout(countdown, 1000)
      }
    }
    const handleClick = () => {
      showModalRef.value = true
      timeoutRef.value = 1000 // 此处设置加载时间
      countdown()
    }
      // const showModal = showModalRef
      // const timeout =  timeoutRef
      const baseURL = ip.baseURL
      const renderIcon = (icon: Component) => {
        return () => {
            return h(NIcon, null, {
            default: () => h(icon)
            })
        }
}
      const options = [
        {
          label: '个人主页',
          key: 'profile',
          icon: renderIcon(UserAvatar)
        },
        {
          label: '编辑我的资料',
          key: 'editProfile',
          icon: renderIcon(Pen)
        },
        {
          label: '退出登录',
          key: 'logout',
          icon: renderIcon(IosLogOut)
        }
      ]
      const message = useMessage()
      async function handleSelect (key: string | number) {
        // message.info(String(key))
        // 1. 每次发送请求前，先获取token放在请求头中，若为空则设置Authorization空 
        // const token = localStorage.getItem('token')
        if (String(key) == 'profile'){
          axios({
            url:useIPStore().baseURL + '/user/my-info',
          })
              .then(function (resp) {
                if (resp.data.data === null) {
                  message.error('不好意思哦,请先登录～')
                  router.push({
                    path:'/login'
                  })
                }
                else {
                  message.success('welcome to your page')
                  router.push({
                    path:'/my-page'
                  })
                }
                console.log(resp.data.data)
              })
      }
      else if (String(key) == 'logout') {
          axios({
            url:useIPStore().baseURL + '/user/logout',
          })
          .then(function (resp) {
            if (resp.data.code === 0) {
              message.success('已退出登录～')
              localStorage.removeItem('user')
              localStorage.removeItem('token')
              localStorage.removeItem('expireTime')
              router.push({
                path:'/login'
              })
            }
            else {
              message.error('请稍后再试')
            }
          })
      }
      else if ( String(key) == 'editProfile') {
          axios({
            url:useIPStore().baseURL + '/user' + '/checkUserLoggedIn'
          })
              .then(function (resp) {
                if (resp.data.code === 0) {
                  router.push({
                    path:'/edit-user-info'
                  })
                }
                else {
                  message.error('您先登录，才能修改自己信息')
                }
              })
        }


    }
    
    /*
    async: The async keyword is used to define an asynchronous function. When you mark a function with async, it means that the function will always return a promise. Inside an async function, you can use the await keyword to pause the execution of the function until a promise is settled (resolved or rejected).

    await: The await keyword can only be used inside an async function. It is used to wait for a promise to settle. When you use await with a promise, the execution of the async function is paused until the promise is resolved. If the promise is resolved, await returns the resolved value. If the promise is rejected, it throws an error, which you can catch using a try...catch block.  
    */
    
    const checkUserLoggedIn = async (): Promise<boolean> => {
    let isLoggedin = false;
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(useIPStore().baseURL + '/user/checkUserLoggedIn',  {
            headers: {
              'Authorization':token
            }
        });
        // await the axios method to be completed then execute the below code
        isLoggedin = response.data.code === 0;
    } catch (error) {
        console.error('Error checking user login status:', error);
        isLoggedin = false;
    }

    return isLoggedin;
}

async function createArticles() {
    try {
        const isLoggedin = await checkUserLoggedIn();
        console.log('Is user logged in?', isLoggedin);
        
        if (isLoggedin) {
            router.push({ path: '/create-articles' });
        } else {
            message.error('请您先登录，再来发表文章哦')
            router.push({ path: '/login' });
        }
    } catch (error) {
        console.error('Error in createArticles:', error);
    }
}


import logo from '../imgs/logo.png'
</script>
<template>
   <n-flex>
      <n-avatar
            size="medium"
            :src="logo"
            style="cursor: pointer;"
          />
          
        <n-breadcrumb separator="">
            <n-breadcrumb-item @click="createArticles()">
            <n-icon :component="MdCreate" /> 创作</n-breadcrumb-item>

            <n-breadcrumb-item @click="router.push({path:'/login'})" v-if="!(user != null)">
              <n-icon :component="IosLogIn" /> 登录</n-breadcrumb-item>

            <n-dropdown 
            :options="options"
            placement="bottom-start"
            @select="handleSelect"
            v-else
            >
                <n-breadcrumb-item @click="handleClick">
                <n-icon :component="UserProfile" /> 我的</n-breadcrumb-item>
            </n-dropdown>
          <n-breadcrumb-item @click="management()" v-if="user!=null && user.role==2">
            <n-icon :component="TaskTools" /> 管理</n-breadcrumb-item>
            <n-input round v-model:value="keyword" type="text" size="small" @keyup.enter = "searchArticle(keyword)" placeholder="输入你想搜索的东西" >
                <template #suffix>
                <n-icon :component="MdSearch"  />
                </template>
            </n-input>
            
        </n-breadcrumb>
          </n-flex>
          
</template>
<style scoped>

</style>