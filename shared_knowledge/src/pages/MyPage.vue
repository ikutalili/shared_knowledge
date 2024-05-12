<script setup lang="ts">
import {
  NAvatar, NButton, NCard, NDivider, NEllipsis, NFlex, NGi, NGrid, NIcon, NModal, NQrCode, NResult,
  NTabPane, NTabs, useDialog, useMessage
} from 'naive-ui';
// import imgurl from '../imgs/Tokyo.jpg'
import {nextTick, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router'
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@vicons/antd"
import {Comment16Regular, Heart16Filled, Heart16Regular,Delete48Regular} from "@vicons/fluent"

import {IosFlag, MdPaperPlane,MdPower} from '@vicons/ionicons4'
import axios from "axios";
import {useIPStore} from "@/store/IPStore.ts";

const baseURL = useIPStore().baseURL
const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const QRCodeFlag = ref(false)
interface Article {
  like: boolean;
  dislike: boolean;
  save: boolean;
  color:string;
  articleText:string;
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
  publishTime: Date;
}
interface User {
  userId: number;
  userName: string;
  gender: number;
  avatarUrl: string;
  email: string;
  password: string;
  profile: string;
  following: number;
  followed: number;
  role: string;
  reported: number;
  numOfArticles: number;
  numOfSaves: number;
  registrationTime: Date; // 使用 Date 类型表示时间戳
}
interface SocialNetwork {
  followings: User[];
  fans: User[];
  saves: Article[];
  likes: Article[];
  write: Article[];
}

const url = useIPStore().baseURL + '/user/view-user-social-network'
const currentURL = useIPStore().currentUrl
//  此用户信息全局共享，具体包含了哪些信息，可以查看user实体类
const userObject = localStorage.getItem('user')
const user:User = JSON.parse(userObject)

const avatarUrl = user == null ? "" : (useIPStore().avatarURL + user.avatarUrl)
// const socialNetwork:SocialNetwork = ref<SocialNetwork>()

const articles:Article[] = ref<Article[]>([])
const likeArticles:Article[] = ref<Article[]>([])
const saveArticles:Article[] = ref<Article[]>([])
const followings:User[] = ref<User[]>([])
const fans:User[] = ref<User[]>([])

const socialNetwork  =ref<SocialNetwork>()
// const articles = ref<Article[]>([]) // ts泛型
// onMounted(  async()=> {
//   const res = await fetchData(url);
//
//   socialNetwork.value = res.data.data;
//   console.log(socialNetwork.value.write)
//
//   debugger;
//   let articles:Article[] = reactive<Article[]>([])
//   let likeArticles:Article[] = reactive<Article[]>([])
//   let saveArticles:Article[] = reactive<Article[]>([])
//   let followings:User[] = reactive<User[]>([])
//   let fans:User[] = reactive<User[]>([])
//
//
// // articles = socialNetwork.value.write
//   console.log('-----------')
//   console.log(socialNetwork.fans)
//   likeArticles = socialNetwork.likes
//   saveArticles = socialNetwork.saves
//   followings = socialNetwork.followings
//   fans = socialNetwork.fans
//   // console.log(socialNetwork.value)
// })

onMounted(  ()=> {
  fetchData2(url);
})

async function fetchData2(url: string) {
  // try {
  const resp = await axios({ url: url });
  if (resp.data.code == 0) {
    socialNetwork.value = resp.data.data;
    console.log(socialNetwork.value)
    let socialNetworkData = socialNetwork.value;
    articles.value = socialNetworkData.write
    likeArticles.value = socialNetworkData.likes
    saveArticles.value = socialNetworkData.saves
    followings.value = socialNetworkData.followings
    fans.value = socialNetworkData.fans
    // debugger
  } else {
    message.error('get data error');
    // return null
  }
  // console.log('articles.value')
  // console.log(articles.value)
  // console.log('articles.value[0]')
  // console.log(articles.value[0])
  // console.log('articles.value[0].articleTitle')
  // console.log(articles.value[0].articleTitle)
  // console.log(articles.value.length)
  for (let i = 0; i < articles.value.length; i++) {
    if (articles.value[i] != null) {
      articles.value[i].articleText = await fetchData3(articles.value[i].articleUrl)
    }
  }
  for (let i = 0; i < likeArticles.value.length; i++) {
    if (likeArticles.value[i] != null) {
      likeArticles.value[i].articleText = await fetchData3(likeArticles.value[i].articleUrl)
    }
  }
  for (let i = 0; i < saveArticles.value.length; i++) {
    if (saveArticles.value[i]) {
      saveArticles.value[i].articleText = await fetchData3(saveArticles.value[i].articleUrl)
    }
  }
  // for (let i = 0; i < followings.values.length; i++) {
  //
  // }
}
async function fetchData3(title: string) {
  const resp = await axios({
    url:useIPStore().baseURL + '/article/' + title
  })
  return resp.data
}
// const articleText = async function fetchData(title: string) {
  // try {

    // if (resp.data.code == 0) {
    //   console.log('hey======');
    //   console.log(resp.data.data);
    //   socialNetwork.value = resp.data.data;
    //   debugger
    // } else {
    //   message.error('get data error');
    //   // return null
    // }

    // return resp.data;
  // } catch (error) {
  //   // 处理错误
  //   console.error(error);
  // }
// }
//  fetchData(url)
// console.log('test01')
// console.log(socialNetwork)
// let articles:Article[] = reactive<Article[]>([])
// let likeArticles:Article[] = reactive<Article[]>([])
// let saveArticles:Article[] = reactive<Article[]>([])
// let followings:User[] = reactive<User[]>([])
// let fans:User[] = reactive<User[]>([])
//
//
// // articles = socialNetwork.value.write
// console.log('-----------')
//
//
// likeArticles = socialNetwork.likes
// saveArticles = socialNetwork.saves
// followings = socialNetwork.followings
// fans = socialNetwork.fans
// console.log('socialNetwork')
// console.log(socialNetwork.write)
// console.log('article-------')
// console.log(articles)
// console.log(likeArticles)
// console.log(saveArticles)
// console.log(followings)
// console.log(fans)
function showWrittenArticles() {
}
function deleteArticle(id, title:string) {
  dialog.warning({
    title: '警告',
    content: '你将删除 『'+title+'』 这篇文章,这将会连同该文章下的所有评论也一并删除,确定吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      axios({
        method:'delete',
        url:baseURL + 'articles/delete-article/' + id
      })
          .then(function (resp) {
            if (resp.data.code == 0) {
              message.success('已删除该文章')

              // getData('文章管理')
            }else {message.error('删除失败，请稍候再试')}
          })
      console.log(id)

    },
    onNegativeClick: () => {
      message.error('已取消')
    }
  })
}
function handleDeleteAccount() {
  dialog.warning({
    title: '警告',
    content: '此操作会永久删除你的账号，你确定？',
    positiveText: '确定',
    negativeText: '再想想',
    onPositiveClick: () => {
      message.success('已删除')
      axios.put(baseURL + 'user/delete-user/' + user.userId)
      router.push({
        path:'login'
      })
    },
    onNegativeClick: () => {
      message.info('已取消')
    }
  })
}
function saveArticle(article: Article) {
  // console.log(save === false)
  if(!article.save){
    axios ({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId + '/save/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.color = 'red'
            article.numOfSaves += 1; // 增加保存数量
            article.save = !article.save
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
  else{
    axios ({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId + '/save/false'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.color = 'black'
            article.numOfSaves -= 1; // 减少保存数量
            article.save = !article.save
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
function likeArticle(article : Article) {
  console.log(article.like)
  // 如果还没点赞，则点了之后赞数 +1 ，图标状态变为已点，否则相反
  if (article.like == false || article.like == null){
    axios({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/like/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            // alert("点赞")
            article.numOfLikes += 1
            article.like = !article.like
            // localStorage.setItem('article',JSON.stringify(article))
            console.log(article.numOfLikes)
            console.log(article.like)
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
  else{
    axios({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/like/false'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.numOfLikes -= 1
            article.like = !article.like
            // localStorage.setItem('article',JSON.stringify(article))
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
function dislikeArticle(article :Article) {
  if (article.dislike === false || article.dislike == null){
    axios({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/dislike/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.dislike = !article.dislike
            article.numOfDislikes += 1
            // localStorage.setItem('article',JSON.stringify(article))
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
  else{
    axios({
      method:'put',
      url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/dislike/false'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.dislike = !article.dislike
            article.numOfDislikes -= 1
            // localStorage.setItem('article',JSON.stringify(article))
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
function unFollowUser(userId) {
  axios({
    method:'put',
    url:baseURL + 'user/unfollow-user/' + user.userId + '/' + userId
  })
      .then(function (resp) {
        if (resp.data.code == 0) {
          message.success('已取消关注 ')
          user.following -= 1
          localStorage.setItem('user',JSON.stringify(user))
        }
      })
}
const showCommentFlag = ref(false)
function showQRCode() {
  QRCodeFlag.value = !QRCodeFlag.value
}
function showComment() {
    showCommentFlag.value = true
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
      const second = datetime.getSeconds().toString().padStart(2,'0');

  // 格式化日期时间
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
</script>
<template>
<div>
    <n-grid :cols="4">
        <n-gi :span="3" class="my-page">  
          <div style="width: 900px;">
            <n-card style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
              <n-flex>
                <n-avatar
                round
                :size="70"
                :src= avatarUrl
                />
                <div class="nickname">{{ user.userName }}</div>
                <span style="margin-left: auto;">
                    <n-button
                        :bordered="false"
                        type="info"
                        block
                        strong
                        style="margin-left: auto;"
                        @click="handleDeleteAccount">
                       <n-icon size="20"><MdPower></MdPower></n-icon>
                      注销账号</n-button>
                  </span>
<!--                <div style="margin-left: 500px">-->
<!--                  <n-button color="#4cb7e6" @click="handleDeleteAccount">-->
<!--                    <n-icon size="20"><MdPower></MdPower></n-icon>-->
<!--                    <span style="margin-left: 10px">永久注销 </span>-->
<!--                  </n-button>-->
<!--                </div>-->


              </n-flex>
             
              <n-flex style="margin-top: 40px;">       
                <div class="desc-word">关注</div>
                <div class="desc-num">{{user.following}}</div>
                <div class="vertical-line"></div>
                <div class="desc-word">粉丝
                </div>
                    
                <div class="desc-num">{{ user.followed }}
                </div>
                    
                <div class="vertical-line"></div>
                <div class="desc-word">文章
                </div>
                    
                <div class="desc-num">{{ user.numOfArticles }}
                </div>
                    
                <div class="vertical-line"></div>
                <div class="desc-word">注册时间
                </div>
                    
                <div class="desc-num">{{ dateFormat(user.registrationTime) }}
                </div>
            </n-flex>
          </n-card>
        </div>
            <!-- <n-divider style="width: 800px;"></n-divider> -->
            <div style="margin-top: 30px;">
              <n-card style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); ">
                <n-tabs type="line" animated>
                  <n-tab-pane name="文章">
                    <div class="empty" v-if="articles === undefined || articles.length === 0 ">
                      <n-result status="404" title="这个人没写过什么东西" description="可能肚子里没墨水">
                      </n-result>
                    </div>
<!--                    <div class="not-empty" v-else>-->
<!--                      <n-result status="404" title="这个人没写过什么东西" description="可能肚子里没墨水">-->
<!--                      </n-result>-->
<!--                    </div>-->
                    <div class="not-empty" v-else v-for="article in articles.filter(a => a)" :key="article.articleId">
                        <n-card :bordered="false" :title="article.articleTitle" size="large">
                      <template #header-extra >
                        <n-avatar
                          round
                          :src= "useIPStore().avatarURL + article.avatar"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ article.authorName }}</n-button>
                      </template>

                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div v-html="article.articleText">
                      </div>
                    </n-ellipsis>
                    <template #footer>
                      <!-- ------ 点赞 -->
                        <n-button text type="info" class="bottom-button" @click="likeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="article.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          {{ article.numOfLikes }}</n-button>
                          <!-- --------踩 -->
                          <n-button text class="bottom-button" color="black" @click="dislikeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="article.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          {{ article.numOfDislikes }}</n-button>

                          <!-- 评论 -->
                          <n-button text class="bottom-button" @click="showComment()">
                          <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular>
                          </n-icon>
                        </template>
                          {{article.numOfComments}}</n-button>
                          <n-modal v-model:show="showCommentFlag">
                            <n-card
                              style="width: 600px"
                              title="评论详情"
                              :bordered="false"
                              size="huge"
                              role="dialog"
                              aria-modal="true"
                            >
                              <template #header-extra>
                                噢！
                              </template>
                              内容
                              <template #footer>
                                尾部
                              </template>
                            </n-card>
                          </n-modal>

                          <!-- 收藏 -->
                          <n-button text type="error" class="bottom-button" @click="saveArticle(article)">
                          <template #icon>
                          <n-icon>
                            <Heart16Filled v-if="article.save"></Heart16Filled>
                            <Heart16Regular v-else></Heart16Regular>
                          </n-icon>
                        </template>收藏
                          </n-button>

                          <!-- 分享 -->
                          <n-button text class="bottom-button"  @click="!QRCodeFlag">
                          <template #icon>
                          <n-icon>
                            <MdPaperPlane ></MdPaperPlane>
                          </n-icon>
                        </template>分享
                        <n-modal v-model:show="QRCodeFlag" >
                            <n-card
                              style="width: auto"
                              :bordered="false"
                              size="huge"
                              role="dialog"
                              aria-modal="true"

                            >
                              <n-qr-code
                              :value="currentURL"
                              color="#409eff"
                              background-color="#F5F5F5"
                            />
                            </n-card>
                          </n-modal>
                          </n-button>

                          <!-- 举报 -->
                          <n-button text type="info" class="bottom-button" @click="deleteArticle(article.articleId,article.articleTitle)">
                          <template #icon>
                          <n-icon>
                            <Delete48Regular></Delete48Regular>
                          </n-icon>
                        </template>删除
                          </n-button>
                      </template>
                  </n-card>
                      <n-divider />
                    </div>
                </n-tab-pane>

                  <n-tab-pane name="点赞">
                    <div class="empty" v-if="likeArticles === undefined || likeArticles.length === 0 ">
                      <n-result status="404" title="这个人不太喜欢赞同别人" description="这样不太好">
                      </n-result>
                    </div>
                    <div class="not-empty" v-else v-for="article in likeArticles.filter(a => a)" :key="article.articleId">
                    <n-card :bordered="false" :title="article.articleTitle" size="large">
<!--                      <div style="margin-top: -20px">-->
<!--                        <h1>{{ article.articleTitle }}</h1>-->
<!--                      </div>-->
                      <template #header-extra >
                        <n-avatar
                          round
                          :src="useIPStore().avatarURL + article.avatar"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ article.authorName }}</n-button>
                      </template>
                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div v-html="article.articleText">
                      </div>
                    </n-ellipsis>
                    <template #footer>
                        <n-button text type="info" class="bottom-button" @click="likeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="article.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          赞{{ article.numOfLikes }}</n-button>

                          <n-button text class="bottom-button" color="black" @click="dislikeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="article.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          踩{{ article.numOfDislikes }}</n-button>

                          <n-button text class="bottom-button">
                            <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular></n-icon>
                        </template>
                            评论{{ article.numOfComments }}
                          </n-button>

                      <!-- 收藏 -->
                      <n-button text type="error" class="bottom-button" @click="saveArticle(article)">
                        <template #icon>
                          <n-icon>
                            <Heart16Filled v-if="article.save"></Heart16Filled>
                            <Heart16Regular v-else></Heart16Regular>
                          </n-icon>
                        </template>收藏
                      </n-button>

                      <!-- 分享 -->
                      <n-button text class="bottom-button"  @click="!QRCodeFlag">
                        <template #icon>
                          <n-icon>
                            <MdPaperPlane ></MdPaperPlane>
                          </n-icon>
                        </template>分享
                        <n-modal v-model:show="QRCodeFlag">
                          <n-card
                              style="width: auto"
                              :bordered="false"
                              size="huge"
                              role="dialog"
                              aria-modal="true"

                          >
                            <n-qr-code
                                :value="currentURL"
                                color="#409eff"
                                background-color="#F5F5F5"
                            />
                          </n-card>
                        </n-modal>
                      </n-button>

                      <!-- 举报 -->
                      <n-button text class="bottom-button" >
                        <template #icon>
                          <n-icon>
                            <IosFlag></IosFlag>
                          </n-icon>
                        </template>举报
                      </n-button>
                      </template>
                  </n-card>
                      <n-divider />
                    </div>
                  
                  </n-tab-pane>

                  <n-tab-pane name="收藏">
                    <div class="empty" v-if="saveArticles === undefined || saveArticles.length === 0 ">
                      <n-result status="404" title="这个人没收藏过什么文章" description="可能不太喜欢">
                      </n-result>
                    </div>
                    <div class="not-empty" v-else v-for="article in saveArticles.filter(a => a)" :key="article.articleId">
                    <n-card :bordered="false" :title="article.articleTitle" size="large">
                      <template #header-extra >
                        <n-avatar
                          round
                          :src = "useIPStore().avatarURL + article.avatar"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ article.authorName }}</n-button>
                      </template>
                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div v-html="article.articleText">
                      </div>
                    </n-ellipsis>
                    <template #footer>
                        <n-button text type="info" class="bottom-button" @click="likeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="article.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          赞{{ article.numOfLikes }}</n-button>

                          <n-button text class="bottom-button" @click="dislikeArticle(article)">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="article.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          踩{{ article.numOfDislikes }}</n-button>
                      <n-button text class="bottom-button">
                        <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular></n-icon>
                        </template>
                        评论{{ article.numOfComments }}
                      </n-button>

                      <!-- 收藏 -->
                      <n-button text type="error" class="bottom-button" @click="saveArticle(article)">
                        <template #icon>
                          <n-icon>
                            <Heart16Filled v-if="article.save"></Heart16Filled>
                            <Heart16Regular v-else></Heart16Regular>
                          </n-icon>
                        </template>收藏
                      </n-button>

                      <!-- 分享 -->
                      <n-button text class="bottom-button"  @click="showQRCode()">
                        <template #icon>
                          <n-icon>
                            <MdPaperPlane ></MdPaperPlane>
                          </n-icon>
                        </template>分享

                        <n-modal v-model:show="QRCodeFlag">
                          <n-card
                              style="width: auto"
                              :bordered="false"
                              size="huge"
                              role="dialog"
                              aria-modal="true"
                          >
                            <n-qr-code
                                :value="currentURL"
                                color="#409eff"
                                background-color="#F5F5F5"
                            />
                          </n-card>
                        </n-modal>
                      </n-button>

                      <!-- 举报 -->
                      <n-button text class="bottom-button" >
                        <template #icon>
                          <n-icon>
                            <IosFlag></IosFlag>
                          </n-icon>
                        </template>举报
                      </n-button>
                      </template>
                  </n-card>
                      <n-divider />
                    </div>
                  </n-tab-pane>

                  <n-tab-pane name="关注">
                    <div class="empty" v-if="followings.length === 0 || false">
                      <n-result status="500" title="这个人还没有关注谁" description="你能成为被他想关注的人吗？">
                      </n-result>
                    </div>
                    <div v-else>
                      <div v-for="following in followings" :key = "following.userId">
                        <n-card :bordered="false" size="large">
                          <n-flex align-items="center">
                            <n-avatar
                                round
                                :src="useIPStore().avatarURL + following.avatarUrl"
                                style="cursor: pointer;"
                            />
                            <div style="line-height: 1; margin-left: 10px; display: flex; align-items: center;">
                              <h3 style="margin: 0;">{{ following.userName }}</h3>
                            </div>
                            <span style="margin-left: auto;">
                              <n-button
                                  :bordered="false"
                                  size="small"
                                  type="info"
                                  block
                                  strong
                                  style="margin-left: auto;"
                                  @click="unFollowUser(following.userId)"
                              >取消关注</n-button>
                            </span>
                          </n-flex>
                          </n-card>
                            <n-divider/>
                      </div>
                    </div>
                  </n-tab-pane>

                  <n-tab-pane name="粉丝">
                    <div class="empty" v-if="fans.length === 0 || fans === undefined">
                      <n-result status="500" title="这个人没有一个粉丝" description="谁会是第一个呢？">
                      </n-result>
                    </div>
                    <div v-else>
                      <div v-for="fan in fans" :key = "fan.userId">
                        <n-card :bordered="false" size="large">
                          <n-flex align-items="center">
                            <n-avatar
                                round
                                :src="useIPStore().avatarURL + fan.avatarUrl"
                                style="cursor: pointer;"
                            />
                            <div style="line-height: 1; margin-left: 10px; display: flex; align-items: center;">
                              <h3 style="margin: 0;">{{ fan.userName }}</h3>
                            </div>
<!--                            <span style="margin-left: auto;">-->
<!--                              <n-button :bordered="false" size="small" type="info" block strong style="margin-left: auto;">取消关注</n-button>-->
<!--                            </span>-->
                          </n-flex>
                        </n-card>
                        <n-divider/>
                      </div>
                    </div>
                  </n-tab-pane>
                </n-tabs>
              </n-card>
            </div>
            <div>
            </div>
           
        </n-gi>
        <n-gi>

        </n-gi>
    </n-grid>
   
</div>
</template>
<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Protest+Strike&display=swap'); */
/* @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&family=Protest+Strike&display=swap'); */
.my-page{
   
  /* border-radius: 18px;
  padding: 50px;
  background: inherit;
  overflow: hidden;  
  background-color: #F6F6F6;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);   */
/* background-color:rgba(251, 234, 235,0.5);*/
}
.empty{
  width:900px;
  height:200px
}
.hr-basic {
  border: none;
  height: 1px;
  background-color: #333; /* 您可以更改颜色 */
  margin: 20px 0;
}

.vertical-line{
  border-left: 1px solid black; /* 设置左边框 */
  height: 30px; /* 设置分割线高度 */
}
.desc-word{
  font-size: 20px;
  font-weight: 400;
  font-family: 'Playfair Display', sans-serif;
}
.desc-num{
  font-size: 20px;
  font-weight: 800;
  font-family: 'Protest Strike', sans-serif;
  /* font-family: 'Playfair Display', sans-serif; */
}
.nickname{
  margin-top: 15px;
  font-size: 30px;
  font-weight: bold;
}
/* .tab-word:first-child{
  font-size: 20px;
  font-weight: 400;
  font-family: 'Playfair Display', sans-serif;
}
.tab-word:nth-child(n+2){
  margin-left: 30px;
  font-size: 20px;
  font-weight: 400;
  font-family: 'Playfair Display', sans-serif;
} */
.bottom-button:nth-child(n+2){
  margin-left: 30px;
}
.preview-text{
  font-size:17px
}
</style>