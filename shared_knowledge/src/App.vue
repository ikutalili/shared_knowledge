
<script setup lang="ts">
    // import HelloWorld from './components/HelloWorld.vue'
    import SideContent from './components/SideContent.vue'
    import HeaderContent from './components/HeaderContent.vue';
    // import ArticlesList from '@/pages/ArticlesList.vue'
    import {
      NLayout,NLayoutContent,NLayoutFooter,NLayoutHeader,NLayoutSider, NSpace,NIcon,NMessageProvider,NLoadingBarProvider,
      NDialogProvider,
    } from 'naive-ui'
    import {
      LogoFacebook,LogoTwitter,LogoInstagram,
    } from '@vicons/ionicons4'
    import {RouterView} from 'vue-router' 
    import {useSideContentStore} from './store/SideContent'
    //定义仓库变量
    const sideContentStore = useSideContentStore()

    /**
     * 
     * // 将一个对象存储在LocalStorage中
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      // 从LocalStorage中获取存储的对象并将其转换为原始对象
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser);
      } else {
        console.log('No user found in LocalStorage');
      }

     */
   
</script>

<template>
  <n-loading-bar-provider>
     <div >
  <n-space vertical size="large">
    <n-layout >
      <!-- 顶部导航区 -->
      <div>
        <n-layout-header>
            <n-message-provider>
              <HeaderContent></HeaderContent>
            </n-message-provider>
      </n-layout-header>
    </div>
    <!-- 侧面导航区(话题广场) 和 主要内容展示区-->
    <div>
      <n-layout has-sider class="main">
        <div >
          <n-layout-sider content-style="padding: 24px;">
            <n-message-provider>
              <SideContent v-show="sideContentStore.show"></SideContent>
            </n-message-provider>       
          </n-layout-sider>
        </div>

        <div>
          <n-layout-content content-style="padding: 24px;"> 
            <n-message-provider>
              <n-dialog-provider>
                  <router-view class="main-content"></router-view>
              </n-dialog-provider>
            </n-message-provider>                 
          </n-layout-content>
        </div>
        
      </n-layout>  
    </div>
       <!-- 页脚 -->
    <div>
      <n-layout-footer v-show="false">
        <n-icon size="40" :component="LogoFacebook"></n-icon>
        <n-icon size="40" :component="LogoTwitter"></n-icon>
        <n-icon size="40" :component="LogoInstagram"></n-icon>
      </n-layout-footer>
    </div>
      
    </n-layout>
  </n-space>
  </div>
  </n-loading-bar-provider>
 
</template>

<style scoped>
.n-layout-header {
  padding: 24px;
  background-color: #b2f0f5;
}
.n-layout-footer {
  padding: 24px;
}

</style>
