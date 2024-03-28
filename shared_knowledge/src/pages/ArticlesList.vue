<script setup lang="ts">
import {NAvatar, NButton, NCard, NEllipsis, NFlex, NIcon, NTag, useLoadingBar, useMessage} from 'naive-ui'
import {Comment16Regular, Heart16Filled, Heart16Regular,} from "@vicons/fluent"
import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const msg = useMessage()
const loading = useLoadingBar()
const userObj = localStorage.getItem('user')
const user = JSON.parse(userObj)
console.log(user)
const baseURL = 'http://localhost:5173/api/'
// const color = ref('')
interface Article {
  like:boolean;
  dislike:boolean;
  save:boolean;
  color:string;
  articleId: string;
  authorId: string;
  authorName: string;
  avatar: string;
  articleTitle: string;
  articleUrl: string;
  articleType: string;
  articleCoverUrl: string;
  articleImages: string;
  numOfLikes: number;
  numOfDislikes: number;
  numOfSaves: number;
  numOfComments: number;
  publishTime: Date; // 根据数据库存储的格式定义

  profile:string;
  hasFollowed:string;
  followingCounts:number;
  fansCounts:number;
  preview:string
}
const articles = ref<Article[]>([]) // ts泛型
const fetchData = () => {
loading.start()
axios({
    url:baseURL + 'articles/list/' + route.params.type
})
.then(function (resp) {
    if (resp.data.code === 0) {
        articles.value = resp.data.data.map(article => {
        article.save = JSON.parse(article.save);
        article.color = article.save ? 'red' : 'black'; // 根据 save 的值设置 color
        return article;
});
        loading.finish()
    }
    else {
        msg.error('something wrong')
        loading.error()
    }
})
}
console.log(articles.value)
// 在 setup 函数中调用 fetchData 函数，以便在组件初始化时获取数据
fetchData()
    // 使用 watch 函数监听路由参数的变化，并在变化时重新获取数据
watch(() => route.params.type, fetchData)
  
console.log(articles)
function saveArticle(article: Article) {
    // console.log(save === false)
    if(!article.save){
        article.color = 'red'
        axios ({
            method:'put',
            url:baseURL + 'articles/operation-to-article/' + article.articleId + '/save/true'
        })
        article.numOfSaves += 1; // 增加保存数量
        article.save = !article.save
    }
    else{
        article.color = 'black'
        axios ({
            method:'put',
            url:baseURL + 'articles/operation-to-article/' + article.articleId + '/save/false'
        })
        article.numOfSaves -= 1; // 减少保存数量
        article.save = !article.save
    }
    
}
function followUser(which: number,article) {
  if (which == 1) { // 1代表要取消关注
    console.log(article.hasFollowed)
    axios({
      method:'put',
      url:baseURL + 'user/unfollow-user/' + user.userId + '/' + article.authorId
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            // articles.value = articles.value.map(a => {
            //   if (a.authorId == article.authorId) {
            //     a.hasFollowed = 'false'
            //     a.fansCounts -= 1
            //     return a
            //   }
            // })
            articles.value.forEach(a => {
              if (a.authorId == article.authorId) {
                a.hasFollowed = 'false';
                a.fansCounts -= 1;
              }})
            msg.success('you have unfollowed he/she!')
          }
        })
  }
  else {
    console.log(article.hasFollowed+'-----')
    axios({
      method:'put',
      url:baseURL + 'user/follow-user/' + user.userId + '/' + article.authorId
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            // article.hasFollowed = 'true'
            // article.fansCounts += 1
            articles.value.forEach(a => {
              if (a.authorId == article.authorId) {
                a.hasFollowed = 'false';
                a.fansCounts -= 1;
              }
            })
            msg.success('you have followed he/she!')
          }
        })
  }
}
// 此数据从sidecontent中得来，是一系列的文章展示
// const articleObj = localStorage.getItem('articles')
// const articles = JSON.parse(articleObj)
const coverUrl = ref('http://localhost:8080/avatar-image/2/')
const avatarUrl = ref('http://localhost:8080/avatar-image/1/')

function clickArticle (article : object,articleUrl : string) { // 此处参数的article是列出来的文章中点击的其中一篇，是一个对象，暂时通过localstorage传递信息
        router.push({
            name:'content',
            params:{
                articleId:articleUrl // url中传递uuid文章的标题
            },
        })
        localStorage.setItem('article',JSON.stringify(article))
        // console.log(article)
}
const showCard = ref(false)
function showAuthorCard() {
    msg.success('ok')
}
function dateFormat(datetime:Date) {
    // 使用 Date 对象创建一个 datetime 对象
    datetime = new Date(datetime);

    // 使用 Date 对象的方法获取具体的日期和时间
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1; // 月份从 0 开始，所以要加 1
    const day = datetime.getDate();
    const hour = datetime.getHours().toString().padStart(2,'0');
    const minute = datetime.getMinutes().toString().padStart(2,'0');
    // const second = datetime.getSeconds();

// 格式化日期时间
    // const formattedDatetime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return `${year}-${month}-${day} ${hour}:${minute}`
}
</script>
<template>
    <n-flex >
        <div v-for="article in articles" :key="article.articleId" class="main-panel">
            <n-card :bordered="false">
                <template #cover>
                    <img :src="coverUrl + article.articleCoverUrl " @click="clickArticle(article,article.articleUrl)" alt="article-cover" class="cover">
                </template>
                
                <div class="title">
                    {{article.articleTitle}}
                </div>       
                <div style="margin-left: -25px;">
                  <n-ellipsis style="max-width: 240px" :line-clamp="2">
                    {{ article.preview }}
                  </n-ellipsis>
                </div>      
            <template #footer>
                <div style="margin-left: -25px;margin-top: -10px;">
                    <n-flex>
                    <div class="avatar">
                    <n-avatar
                        round
                        :size="30"
                        :src='avatarUrl + article.avatar'
                        />
                    </div>
                      <div class="info-card">
                        <n-card>
                          <n-flex style="align-items: center; margin-bottom: 10px;"> <!-- 调整margin-bottom -->
                            <n-avatar
                                round
                                :size="30"
                                :src='avatarUrl + article.avatar'
                            />
                            <p>{{ article.authorName }}</p>
                          </n-flex>
                          <n-flex style="margin-top: -30px;"> <!-- 调整margin-bottom -->
                            <p>关注：<span style="font-weight: bold;">{{ article.followingCounts }}</span></p>
                            <p>粉丝：<span style="font-weight: bold;">{{ article.fansCounts }}</span></p>
                          </n-flex>
                          <hr style="border-top: 1px solid #ccc;margin-top: -10px">
                          <p style="margin-bottom: 20px;"> <!-- 调整margin-top -->{{ article.profile }}</p>
                          <n-flex>
                            <n-button type="info" block size="small" v-if="article.hasFollowed == 'true'" @click="followUser(1,article)">
                              取消关注
                            </n-button>
                            <n-button type="info" block size="small" v-else @click="followUser(2,article)">
                              关注
                            </n-button>
                          </n-flex>
                        </n-card>
                      </div>


                      <div class="bottom-info author-name">
                        <!-- 此处应该是作者名字 -->
                        {{ article.authorName }}
                    </div>
                    <div class="bottom-info">{{ dateFormat(article.publishTime) }}</div>

                </n-flex>
                <n-flex>
                      <div>
                    <n-button text :color="article.color" class="bottom-button-article" @click="saveArticle(article);
                    ">
                    <template #icon>
                    <n-icon >
                        <Heart16Filled v-if="article.save"></Heart16Filled>
                        <Heart16Regular v-else></Heart16Regular>
                    </n-icon>
                </template>{{ article.numOfSaves !== null ? article.numOfSaves : 0 }}
                    </n-button>
                </div>
                <div>
                    <n-button text color="black" class="bottom-button-article">
                    <template #icon>
                    <n-icon>
                        <Comment16Regular></Comment16Regular>
                    </n-icon>
                    </template>
                    {{ article.numOfComments !== null ? article.numOfComments : 0 }}
                </n-button>
                </div>
                <div>
                    <n-tag :bordered="false" type="warning" :color="{color:'white'}">
                        # {{ article.articleType }}
                    </n-tag>
                </div>
                </n-flex>
               
                </div>
            </template>
     </n-card>
        </div>
    </n-flex>
</template>
<style scoped>
.n-card {
  max-width: 300px;
  margin-left: 30px;
}
.title{
    font-family: 'Courier, monospace';
    margin-left: -25px;
    margin-top: 20px;
    font-size: 25px;
    font-weight: bold;
    cursor: pointer;
}
.bottom-info{
    cursor:pointer;
    font-size: 15px;
}
.author-name:hover{
    color: aqua;
}
.cover{
    cursor:pointer;
    width:300px;
    height: 216px;
}
.main-panel{
    border-radius: 18px;
    /* padding: 20px; */
    padding-top: 30px;
    padding-right: 30px;
    background: inherit;
    /* overflow: hidden; */
    /* background-color: #FBEAEB; */
    /* background-color:rgba(251, 234, 235,0.5); */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
    transition: box-shadow 0.3s ease; /* 添加过渡效果，使悬浮效果更平滑 */
}
.main-panel:hover{
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* 鼠标悬浮时的阴影效果 */
}
.info-card{
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: visibility 0s, opacity 0.5s linear;
  margin-top: 10px;
  z-index: 1; /* 添加这一行 .card元素的z-index被设置为1，这意味着它会覆盖z-index值较低的元素。bottom: 50px;则是将卡片向上移动50px*/
  bottom: 50px;
}
.avatar:hover + .info-card ,
.info-card:hover{
  cursor: pointer;
  visibility: visible;
  opacity: 1;
}
</style>