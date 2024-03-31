<script setup lang="ts">
    // import { ref } from 'vue';
    import { useRouter,useRoute } from 'vue-router';
    // const route = useRoute()

    import {
      NIcon,NBreadcrumb,NBreadcrumbItem,NFlex
    } from 'naive-ui'
    import {
      IosDesktop,IosEasel,IosPeople
    } from '@vicons/ionicons4'
    import {
      Apple,Cafe,Basketball,Arrival,ColorPalette
    } from "@vicons/carbon"
    import {News20Regular} from "@vicons/fluent"
    import {Fire} from "@vicons/carbon"
    // import axios from 'axios'
    // const message = useMessage()
    // const loading = useLoadingBar()
    const router = useRouter()
  //   function delay(ms: number) {
  //   return new Promise( resolve => setTimeout(resolve, ms) );
  // }

    // const baseURL = 'http://localhost:5173/api'
    function showArticles(type:string) {
      router.push({
        name:'article-list',
        params:{
          type:type
        }
      })
    }
       
      
</script>
<template>
  <div class="side-content">
      <n-breadcrumb separator="">
      <n-flex vertical align="center">
          <n-breadcrumb-item @click="showArticles('排行榜')" >
          <n-icon :component="Fire"/> 排行榜</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('编程')">
          <n-icon :component="IosDesktop" /> 编程</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('新闻')">
          <n-icon :component="News20Regular" /> 新闻</n-breadcrumb-item>

          <n-breadcrumb-item  @click="showArticles('美食')">
          <n-icon :component="Apple" /> 美食</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('工作')">
          <n-icon :component="IosEasel" /> 工作</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('生活')">
          <n-icon :component="Cafe" /> 生活</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('社会')">
          <n-icon :component="IosPeople" /> 社会</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('艺术')">
          <n-icon :component="ColorPalette" /> 艺术</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('娱乐')">
          <n-icon :component="Basketball" /> 娱乐</n-breadcrumb-item>

          <n-breadcrumb-item @click="showArticles('旅行')">
          <n-icon :component="Arrival" /> 旅行</n-breadcrumb-item>  
          <n-breadcrumb-item>
          </n-breadcrumb-item> 
      </n-flex>
  </n-breadcrumb>
    <!-- </n-space> -->

  </div>

</template>
<style scoped>
.n-breadcrumb-item{
  font-size:20px
}
.side-content{
  /* text-align: center; */
  font-weight: 600;
  align-items: center;
  border-radius: 18px;
  padding: 50px;
  background: inherit;
  overflow: hidden;
  background-color: #FFE2E2;
  /* background-color:rgba(251, 234, 235,0.5); */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}

</style>