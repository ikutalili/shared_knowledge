<script setup lang="ts" name="ContentShow">
import {
  NAvatar, NButton, NCard, NCollapse, NCollapseItem, NFlex, NGi, NGrid, NIcon, NInput, NModal, NQrCode, NTag,
  useMessage
} from 'naive-ui';
import {reactive, ref} from 'vue'
import imgurl from '../imgs/Tokyo.jpg'
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@vicons/antd"
import {Comment16Regular, Heart16Filled, Heart16Regular} from "@vicons/fluent"
import {IosFlag, MdPaperPlane} from '@vicons/ionicons4'
import {useRoute} from 'vue-router'
import axios from 'axios'
import {useIPStore} from "@/store/IPStore.ts";
const route = useRoute()
// console.log('id===>'+route.params.articleId)
const title = route.params.articleId  // 此为uuid标题
const message = useMessage()
const showModal = ref(false)
// const baseURL = 'http://localhost:5173/api/'
const baseURL = useIPStore().baseURL + '/'
const currentURL = window.location.href
const articleHtml = ref('')
const userObj = localStorage.getItem('user')
const showShareCard = ref(false)
let user = reactive(JSON.parse(userObj))
const articleObj = localStorage.getItem('article')

interface Article {
  like: boolean;
  dislike: boolean;
  save: boolean;
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
  publishTime: Date;
}
// let article = reactive(JSON.parse(articleObj))
const article = reactive<Article>(JSON.parse(articleObj))
article.color = article.save ? 'red' : 'black'

interface Comments {
  flComment: flComment;
  slComments: slComment[];
}
interface flComment {
  // 定义 FLComment 属性
  like:boolean
  dislike:boolean
  flCommentId:number
  userId:number
  userName:string
  avatar:string
  articleId:number
  comment: string
  numOfLikes: number
  numOfDislikes: number
  commentTime: Date
}

interface slComment {
  // 定义 SLComment 属性
  like:boolean;
  dislike:boolean
  slCommentId: number;
  flCommentId:number,
  replyUserId: number;
  repliedUserId: number;
  replyUserName: string;
  repliedUserName: string;
  replyAvatar: string;
  repliedAvatar: string;
  articleId: number;
  comment: string;
  numOfLikes: number;
  numOfDislikes: number;
  commentTime: Date;
}
const reportReasonsForArticle = [
  '有害信息',
  '骚扰侵犯',
  '垃圾广告',
  '违法违规',
  '涉嫌侵权',
  '抄袭',
  '网络暴力',
  '涉嫌诈骗'
]
const reportReasonsForComment = [
  '有害信息',
  '骚扰侵犯',
  '垃圾广告',
  '违法违规',
  '网络暴力',
  '涉嫌诈骗'
]
const selectReason = ref('')
const selectReasonShow = ref(false)
const reportFLC = ref({})
const reportSLC = ref({})
const reportDisable = ref(true)
function handleTagClick(reason:string) {
  selectReason.value = reason
  selectReasonShow.value = true
  reportDisable.value = false
}
function reportComment(which:number,id:number,reason:string) {
  reportDisable.value = true
    // report-comment/{which}/{commentId}/{reason}"
    axios({
      method:'put',
      url:baseURL + 'report-comment/' + which + '/' + id + '/' + reason
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            message.success('举报成功')
          }
          else if(resp.data.message == 'noLogin') {
            message.error('不支持匿名，请先登录再举报哦～')
          }
          else {
            message.error('请稍候再试')
          }
        })
}
function reportArticle(id:string, reason:string) {
    // "report-article/{reason}/{articleId}"
    axios({
      method:'put',
      url:baseURL + 'articles/report-article/' + reason + '/' + id
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            message.success('举报成功')
            showModal.value = false
          }
          else if (resp.data.message == 'noLogin'){
            message.error('不支持匿名，请先登录再举报哦～')
            showModal.value = false
          }
          else {
            message.error('请稍候再试')
            showModal.value = false
          }
        })
}
// 初始化的时候获取文章html文本数据
axios ({
  url:baseURL + 'article/' + title
})
.then( function (resp) {
  if (resp.status === 404) {
    message.error('抱歉,你看的是404文章')
  }
  else {
    articleHtml.value = resp.data
  }
})
// 随后获取所有评论数据
const comments = ref<Comments[]>([]);

const getComments = async () => {
   await axios ({
    // url:baseURL + 'all-comments/' + article.articleId + '/' + user.userId
     url:baseURL + 'all-comments/' + article.articleId
  })
  .then( function (resp) {
    comments.value = resp.data.data
    console.log(comments.value)
  })
  .catch(function (error) {
    console.log(error)
  })
}
getComments()
// let intervalId  = null
// watchEffect(() => {
//   getComments();
//   intervalId  = setInterval(getComments, 200000); // 每 1 秒钟获取一次最新评论
//   return () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       intervalId = null;
//     }
//   };
// });

// do not change this!!
const flcomments = reactive({
  // userId:user.userId,
  // userName:user.userName,
  // avatar:user.avatarUrl,
  articleId:article.articleId,
  comment:'',
  numOfLikes:0,
  numOfDislikes:0,
})
const slcomments = reactive({
  flCommentId:'',
  // replyUserId:user.userId,
  repliedUserId:'',
  // replyUserName:user.userName,
  repliedUserName:'',
  // replyAvatar:user.avatarUrl,
  articleId:article.articleId,
  comment:'',
  numOfLikes:0,
  numOfDislikes:0,
})
const flagFLC = ref({})
const flagSLC = ref({})

function sendComment() {
  if (flcomments.comment != '') {
    axios({
      method:'post',
      url:baseURL + 'flComment/' + article.articleId,
      data:flcomments
    })
        .then( function(resp) {
          if (resp.data.code === 0) {
            message.success('评论成功')
            flcomments.comment = ''
            article.numOfComments += 1
            localStorage.setItem('article',JSON.stringify(article))
            getComments()
          }
          else if (resp.data.message == 'noLogin') {
            message.error('不支持匿名发言哦～请先登录再发表评论 ')
          }
          else {
            message.error('请稍后再试')
          }
        })
  }
  else {
    message.error('评论不能为空')
  }

}
// 代表第一层评论的回复
function replyFLComment(repliedId,flCommentId,repliedName) {
  slcomments.repliedUserId = repliedId
  slcomments.flCommentId = flCommentId
  slcomments.repliedUserName = repliedName
  if (slcomments.comment != '') {
    axios({
      method:'post',
      url:baseURL + 'slComment/' + article.articleId,
      data:slcomments
    })
        .then(function (resp) {
          if (resp.data.code === 0) {
            message.success('评论成功')
            slcomments.comment = ''
            article.numOfComments += 1
            localStorage.setItem('article',JSON.stringify(article))
            getComments()
          }
          else if (resp.data.message == 'noLogin') {
            message.error('不支持匿名发言哦～请先登录再发表评论 !')
          }
          else {
            message.error('请稍后再试')
          }
        })
  }
  else {
    message.error('评论不能为空!')
  }


}
// 代表第二层评论的回复
function replySLComment(repliedId,flCommentId,repliedName) {
  slcomments.repliedUserId = repliedId
  slcomments.flCommentId = flCommentId
  slcomments.repliedUserName = repliedName
  if (slcomments.comment != '') {
    axios({
      method:'post',
      url:baseURL + 'slComment/' + article.articleId,
      data:slcomments
    })
        .then(function (resp) {
          if (resp.data.code === 0) {
            message.success('评论成功')
            slcomments.comment = ''
            article.numOfComments += 1
            localStorage.setItem('article',JSON.stringify(article))
            getComments()
          }
          else if (resp.data.message == 'noLogin') {
            message.error('不支持匿名发言哦～请先登录再发表评论 !')
          }
          else {
            message.error('请稍后再试')
          }
        })
  }
  else {
    message.error('评论不能为空!')
  }
}
function operationToArticle() {
    if(article.save === false){
      axios ({
        method:'put',
        url:baseURL + 'articles/operation-to-article/' + article.articleId + '/save/true'
      })
          .then(function (resp) {
            if (resp.data.code == 0) {
              article.color = 'red'
              article.numOfSaves += 1
              article.save = !article.save
              localStorage.setItem('article',JSON.stringify(article))
            }
            else if (resp.data.message == 'noLogin') {
              message.error('please login first !')
            }
          })

    }
    else{
      axios ({
        method:'put',
        url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/save/false'
      })
          .then(function (resp) {
            if (resp.data.code == 0) {
              article.color = 'black'
              article.numOfSaves -= 1
              article.save = !article.save
            }
            else if (resp.data.message == 'noLogin') {
              message.error('please login first !')
            }
          })
      localStorage.setItem('article',JSON.stringify(article))
    }
}
function likeArticle() {
  // 如果还没点赞，则点了之后赞数 +1 ，图标状态变为已点，否则相反
  if (article.like === false){
    axios({
      method:'put',
        url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/like/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.numOfLikes += 1
            article.like = !article.like
            localStorage.setItem('article',JSON.stringify(article))
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
            localStorage.setItem('article',JSON.stringify(article))
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
function dislikeArticle() {
  if (article.dislike === false){
    axios({
      method:'put',
        url:baseURL + 'articles/operation-to-article/' + article.articleId  + '/dislike/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            article.dislike = !article.dislike
            article.numOfDislikes += 1
            localStorage.setItem('article',JSON.stringify(article))
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
            localStorage.setItem('article',JSON.stringify(article))
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
// "likeComment/{articleId}/{userId}/{which}/{commentId}/{bool}"
function likeComment(comment,which:string,id) {
  console.log(comment.like === true)
  if (comment.like) {
    axios({
      method:'put',
      // url:baseURL + 'likeComment/' + article.articleId + '/' + user.userId + '/' + which + '/' + id +'/false'
      url:baseURL + 'likeComment/' + article.articleId + '/' + which + '/' + id +'/false'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            comment.numOfLikes -= 1
            comment.like = !comment.like
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
  else {
    axios({
      method:'put',
      // url:baseURL + 'likeComment/' + article.articleId + '/' + user.userId + '/' + which + '/' + id +'/true'
      url:baseURL + 'likeComment/' + article.articleId + '/' + which + '/' + id +'/true'
    })
        .then(function (resp) {
          if (resp.data.code == 0) {
            comment.numOfLikes += 1
            comment.like = !comment.like
          }
          else if (resp.data.message == 'noLogin') {
            message.error('please login first !')
          }
        })
  }
}
function dislikeComment(comment,which:string,id) {
    // console.log('dislike'+id)
    // console.log(baseURL + 'dislikeComment/' + article.articleId + '/' + user.userId + '/' + which + '/' + id +'/false')
    if (comment.dislike) {
      axios({
        method:'put',
        // url:baseURL + 'dislikeComment/' + article.articleId + '/' + user.userId + '/' + which + '/' + id +'/false'
        url:baseURL + 'dislikeComment/' + article.articleId + '/' + which + '/' + id +'/false'
    })
          .then(function (resp) {
            if (resp.data.code == 0) {
              comment.numOfDislikes -= 1
              comment.dislike = !comment.dislike
            }
            else if (resp.data.message == 'noLogin') {
              message.error('please login first !')
            }
          })
    }
    else {
      axios({
        method:'put',
        // url:baseURL + 'dislikeComment/' + article.articleId + '/' + user.userId + '/' + which + '/' + id +'/true'
        url:baseURL + 'dislikeComment/' + article.articleId + '/'  + which + '/' + id +'/true'
    })
          .then(function (resp) {
            if (resp.data.code == 0) {
              comment.numOfDislikes += 1
              comment.dislike = !comment.dislike
            }
            else if (resp.data.message == 'noLogin') {
              message.error('please login first !')
            }
          })
    }
}
function showComment() {
  }
function test() {
  console.log(imgurl)
}
function dateFormat(datetime:Date) {
        // 使用 Date 对象创建一个 datetime 对象
        datetime = new Date(datetime);

        // 使用 Date 对象的方法获取具体的日期和时间
        const year = datetime.getFullYear();
        const month = datetime.getMonth() + 1; // 月份从 0 开始，所以要加 1
        const day = datetime.getDate();
        const hour = datetime.getHours();
        const minute = datetime.getMinutes();
        const second = datetime.getSeconds();

    // 格式化日期时间
  // const formattedDatetime = `${year}-${month}-${day} ${hour}:${minute}`;
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
</script>
<template>
    <div>
        <n-grid :cols="4">
            <n-gi :span="3" style="margin-left: 20px;">
              <!-- 整篇文章所要展示的内容 -->
              <div class="article-content" >
                <!-- 展示标题 -->
                <div>
                  <div class="title" style="text-align: center;font-size: 20px;">
                    <h1 >
                      {{article.articleTitle}}
                    </h1>
                  </div>
                  <!-- 展示作者头像，名字信息 -->
                  <div class="authorInfo">
                    <n-flex>
                      <div>
                        <n-avatar
                          round
                          :size="30"
                          :src="useIPStore().avatarURL + article.avatar"
                          @click="test()"
                        />
                      </div>
                      <div style="font-size: 20px;font-weight: bold;">
                        {{ article.authorName }}
                      </div>
                    </n-flex>
                  </div>
                  <!-- 展示文章正文 -->
                  <div class="article-text" v-html="articleHtml">
                  </div>
                    
                </div>
                <div>
                  <h4>编辑于 {{dateFormat(article.publishTime)}}</h4>
                </div>
              </div>
              <!-- 赞，踩，评论等按钮展示区 -->
      <div>
         <n-button text type="info" class="bottom-button-article" @click="likeArticle()">
              <template #icon>
              <n-icon>
                <LikeFilled v-if="article.like"></LikeFilled>
                <LikeOutlined v-else></LikeOutlined>
              </n-icon>
            </template>
              {{ article.numOfLikes }}</n-button>
              <!-- --------踩 -->
              <n-button text class="bottom-button-article" color="black" @click="dislikeArticle()">
              <template #icon>
              <n-icon>
                <DislikeFilled v-if="article.dislike"></DislikeFilled>
                <DislikeOutlined v-else></DislikeOutlined>
              </n-icon>
            </template>
              {{ article.numOfDislikes }}</n-button>

              <!-- 评论 -->
              <n-button text class="bottom-button-article" @click="showComment()">
              <template #icon>
              <n-icon>
                <Comment16Regular></Comment16Regular>
              </n-icon>
            </template>
              {{ article.numOfComments }}</n-button>

              <!-- 收藏 -->
              <n-button text :color="article.color" class="bottom-button-article" @click="operationToArticle()">
              <template #icon>
              <n-icon>
                <Heart16Filled v-if="article.save"></Heart16Filled>
                <Heart16Regular v-else></Heart16Regular>
              </n-icon>
            </template>{{ article.numOfSaves }}
              </n-button>

              <!-- 分享 -->
              <n-button text class="bottom-button-article" @click="showShareCard = !showShareCard">
              <template #icon>
              <n-icon>
                <MdPaperPlane ></MdPaperPlane>
              </n-icon>
            </template>分享
            <n-modal  v-model:show = "showShareCard">
                <n-card
                  style="width: auto"
                  :bordered="false"
                  size="huge"
                  role="dialog"
                  aria-modal="true"
                >
                  <n-qr-code
                  :value=currentURL
                  color="#409eff"
                  background-color="#F5F5F5"
                />
                </n-card>
              </n-modal>
              </n-button>

              <!-- 举报 -->
              <n-button text class="bottom-button-article" color="black" @click="
              selectReasonShow = false;
              selectReason = '';
              showModal = true;
              ">
              <template #icon>
              <n-icon>
                <IosFlag></IosFlag>
              </n-icon>
            </template>举报
              </n-button>
        <n-modal v-model:show="showModal">
          <n-card
              style="width: 600px"
              title="请选择举报的原因"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
          >
            <n-flex>
              <n-tag v-for="reason in reportReasonsForArticle" :key="reason" type="error" class="report-reason" @click="handleTagClick(reason)">
                {{ reason }}
              </n-tag>
            </n-flex>
            <hr>
            已选择：
            <n-tag type="info" class="report-reason" v-show="selectReasonShow">
              {{ selectReason }}</n-tag>
            <template #footer>
              <n-button :disabled="reportDisable" type="info" block @click="reportArticle(article.articleId,selectReason)">提交举报</n-button>
            </template>
          </n-card>
        </n-modal>
      </div>
      <!-- 评论区域 我的评论条 -->
      <div style="margin-top: 20px;">
        <n-flex>
          <div v-if="user != null">
              <n-avatar
              round
              :size="30"
              :src="useIPStore().avatarURL + user.avatarUrl"
              />
              </div>
          <div v-else>
            <n-avatar
                round
                :size="30"
                :src="useIPStore().avatarURL + 'noLogin.jpg'"
            />
          </div>
            <div style="width:80%">
              <n-input v-model:value="flcomments.comment" type="text" placeholder="留下你的评论吧" />
            </div>
            <div>
              <n-button type="info" @click="sendComment()">发送</n-button>
            </div>
        </n-flex>
      </div>

      <!-- 评论区域 大家的评论详情 -->
      <!-- 
        <div v-for="(item, index) in items" :key="index">
        <div v-if="index === 0">
            这里是只渲染一次的内容 -->
        <!-- </div>
        <div v-if n>=4> 
            这里是在每个项目上都渲染的内容
            {{ item }}
        </div>
    </div> -->
      <NCollapse v-if="false">
        <NCollapseItem title="共12条回复" name='1'>
        </NCollapseItem>
    </NCollapse>
    <div class="comment"  v-for="(comment,index) in comments" :key="index">
      <div class="comment-detail" >
          <n-card :bordered="false">
            <div>
              <!-- 头像，名字区域，需要渲染 -->
              <n-flex>
              <div>
                 <n-avatar
                  round
                  :size="30"
                  :src="useIPStore().avatarURL + comment.flComment.avatar"
                  />
              </div>
              <div style="font-size: 20px;font-weight: bold;" >
                {{ comment.flComment.userName }}
                <n-tag type="info" class="tag" :bordered="false" v-if="comment.flComment.userName === article.authorName">作者</n-tag>
              </div>
              </n-flex>
            </div>
          <div style="padding-left: 40px;margin-top: -15px;font-size: 20px;">
            <div>
               <p>
            {{comment.flComment.comment}}
            </p>
            </div>
           <div style="margin-top: -15px; font-size: 15px;">
            <p>{{dateFormat(comment.flComment.commentTime)}}</p>
           </div>
          </div>
            <div style="margin-left: 40px;margin-top: -15px;">

              <n-button text type="info" class="bottom-button-comment" @click="likeComment(comment.flComment,'1',comment.flComment.flCommentId)">
            <template #icon>
            <n-icon>
              <LikeFilled v-if="comment.flComment.like"></LikeFilled>
              <LikeOutlined v-else></LikeOutlined>
            </n-icon>
          </template>
            {{ comment.flComment.numOfLikes }}</n-button>
            <!-- --------踩 -->
            <n-button text class="bottom-button-comment" color="black" @click="dislikeComment(comment.flComment,'1',comment.flComment.flCommentId)">
            <template #icon>
            <n-icon>
              <DislikeFilled v-if="comment.flComment.dislike"></DislikeFilled>
              <DislikeOutlined v-else></DislikeOutlined>
            </n-icon>
          </template>
            {{ comment.flComment.numOfDislikes }}</n-button>
            <!--   @click="flagFLC[comment.flComment.flCommentId] = !flagFLC[comment.flComment.flCommentId]"   -->
            <n-button text class="bottom-button-comment" @click="flagFLC[comment.flComment.flCommentId] = !flagFLC[comment.flComment.flCommentId]">
              <template #icon>
              <n-icon>
                <Comment16Regular></Comment16Regular>
              </n-icon>
            </template>
              回复</n-button>
            <n-button text class="bottom-button-comment" color="black" @click="
            selectReasonShow = false;
            selectReason = '';
            reportFLC[comment.flComment.flCommentId] = !reportFLC[comment.flComment.flCommentId];
            console.log(reportFLC[comment.flComment.flCommentId])
            ">
            <template #icon>
            <n-icon>
              <IosFlag></IosFlag>
            </n-icon>
          </template>举报
            </n-button>
            </div>

            <div class="reply-input" v-show="flagFLC[comment.flComment.flCommentId]">
              <n-flex>
                <div style="width:80%;margin-left: 40px;">
                  <n-input v-model:value="slcomments.comment" type="text" :placeholder="'回复 ' + comment.flComment.userName" />
                </div>
                <div>
                  <n-button type="info" @click="replyFLComment(comment.flComment.userId,comment.flComment.flCommentId,comment.flComment.userName);
                  flagFLC[comment.flComment.flCommentId] = false
                  ">发送</n-button>
                </div>
              </n-flex>
            </div>
            <div class="report-modal">
              <n-modal v-model:show="reportFLC[comment.flComment.flCommentId]">
                <n-card
                    style="width: 600px"
                    title="请选择举报的原因"
                    :bordered="false"
                    size="huge"
                    role="dialog"
                    aria-modal="true"
                >
                  <n-flex>
                    <n-tag v-for="reason in reportReasonsForComment" :key="reason" type="error" class="report-reason" @click="handleTagClick(reason)">
                      {{ reason }}
                    </n-tag>
                  </n-flex>
                  <hr>
                  已选择：
                  <n-tag type="info" class="report-reason" v-show="selectReasonShow">
                    {{ selectReason }}</n-tag>
                  <template #footer>
                    <n-button type="info" block :disabled="reportDisable"
                    @click="reportComment(1,comment.flComment.flCommentId,selectReason);
                    reportFLC[comment.flComment.flCommentId] = false">提交举报</n-button>
                  </template>
                </n-card>
              </n-modal>
            </div>
          </n-card>
      </div>
    

      <!-- 下面是回复者评论的缩进效果 -->
      <div class="reply-comment-detail" v-if="comment.slComments!==null" v-for="slComment in comment.slComments" :key="slComment.slCommentId">
          <n-card :bordered="false">
            <div>
              <!-- 头像，名字区域，需要渲染 -->
              <n-flex>
              <div>
                 <n-avatar
                  round
                  :size="30"
                  :src="useIPStore().avatarURL + slComment.replyAvatar"
                  />
              </div>
              <div style="font-size: 20px;font-weight: bold;" >
                  {{ slComment.replyUserName }}<n-tag type="info" class="tag" :bordered="false" v-if="slComment.replyUserName === article.authorName">作者</n-tag>
                  @ 
                  {{ slComment.repliedUserName }}<n-tag type="info" class="tag" :bordered="false" v-if="slComment.repliedUserName === article.authorName">作者</n-tag>
              </div>
              </n-flex>
            </div>
          <div style="padding-left: 40px;margin-top: -15px;">
            <div style="font-size: 20px;">
               <p>
              {{slComment.comment}}
            </p>
            </div>
           <div style="margin-top: -15px;font-size: 15px;">
            <p>{{ dateFormat(slComment.commentTime) }}</p>
           </div>
          </div>
            <div style="margin-left: 40px;margin-top: -15px;">
              <n-button text type="info" class="bottom-button-comment" @click="likeComment(slComment,'2',slComment.slCommentId)">
            <template #icon>
            <n-icon>
              <LikeFilled v-if="slComment.like"></LikeFilled>
              <LikeOutlined v-else></LikeOutlined>
            </n-icon>
          </template>
            {{ slComment.numOfLikes }}</n-button>
            <!-- --------踩 -->
            <n-button text class="bottom-button-comment" color="black" @click="dislikeComment(slComment,'2',slComment.slCommentId)">
            <template #icon>
            <n-icon>
              <DislikeFilled v-if="slComment.dislike"></DislikeFilled>
              <DislikeOutlined v-else></DislikeOutlined>
            </n-icon>
          </template>
            {{ slComment.numOfDislikes}}</n-button>
            <n-button text class="bottom-button-comment" @click="flagSLC[slComment.slCommentId] = !flagSLC[slComment.slCommentId]">
              <template #icon>
              <n-icon>
                <Comment16Regular></Comment16Regular>
              </n-icon>
            </template>
              回复</n-button>
            <n-button text class="bottom-button-comment" color="black"
            @click="selectReasonShow = false;
            selectReason = '';
            reportSLC[slComment.slCommentId] = !reportSLC[slComment.slCommentId];">
            <template #icon>
            <n-icon>
              <IosFlag></IosFlag>
            </n-icon>
          </template>举报
            </n-button>
            </div>
            <div class="reply-input" v-show="flagSLC[slComment.slCommentId]">
              <n-flex>
                <div style="width:80%;margin-left: 40px;">
                  <n-input v-model:value="slcomments.comment" type="text" :placeholder="'回复 ' + slComment.replyUserName" />
                </div>
                <div>
                  <n-button type="info" @click="replySLComment(slComment.replyUserId,slComment.flCommentId,slComment.replyUserName);
                  flagSLC[slComment.slCommentId] = false
                  ">发送</n-button>
                </div>
              </n-flex>
            </div>
            <div class="report-modal">
              <n-modal v-model:show="reportSLC[slComment.slCommentId]">
                <n-card
                    style="width: 600px"
                    title="请选择举报的原因"
                    :bordered="false"
                    size="huge"
                    role="dialog"
                    aria-modal="true"
                >
                  <n-flex>
                    <n-tag v-for="reason in reportReasonsForComment" :key="reason" type="error" class="report-reason" @click="handleTagClick(reason)">
                      {{ reason }}
                    </n-tag>
                  </n-flex>
                  <hr>
                  已选择：
                  <n-tag type="info" class="report-reason" v-show="selectReasonShow">
                    {{ selectReason }}</n-tag>
                  <template #footer>
                    <n-button :disabled="reportDisable" type="info" block @click="
                    reportComment(2,slComment.slCommentId,selectReason);
                    reportSLC[slComment.slCommentId] = false"
                    >提交举报</n-button>
                  </template>
                </n-card>
              </n-modal>
            </div>
          </n-card>
      </div>
    </div>
      
            </n-gi>
            <n-gi></n-gi>
        </n-grid>
  </div>

</template>
<style scoped>
.reply-comment-detail{
  margin-left: 40px;
}
.bottom-button-article:nth-child(n+2){
  margin-top: 30px;
  margin-left: 30px;
}
.bottom-button-comment:nth-child(n+2){
  margin-left: 30px;
}
.article-content{
  padding: 40px;
  /* width: 300px; */
  min-width: 880px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}
img {
  height: 350px;
  width: 600px;
}
.article-text{
  font-size: 20px;
  
}
.tag{
  font-weight: 500;
}
.report-reason {
  cursor: pointer;
}
</style>