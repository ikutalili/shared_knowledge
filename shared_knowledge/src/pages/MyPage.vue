<script setup lang="ts">
import {
  NAvatar, NButton, NCard, NEllipsis, NFlex, NGi, NGrid, NIcon, NModal, NQrCode, NResult,
  NTabPane, NTabs,useDialog,useMessage
} from 'naive-ui';
import imgurl from '../imgs/Tokyo.jpg'
import {ref} from 'vue';
import {useRouter} from 'vue-router'
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@vicons/antd"
import {Comment16Regular, Heart16Filled, Heart16Regular} from "@vicons/fluent"
import {IosFlag, MdPaperPlane,MdPower} from '@vicons/ionicons4'
import axios from "axios";

const baseURL = 'http://localhost:5173/api'
const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const articles = ref({
    articleId:'001',
    title:'你好好好',
    author:'mizuno',
    content:'iodsajiopdas',
    numOfLike:2314,
    numOfDislike:235,
    like:false,
    dislike:false,
    showComment:false,
    saveArticle:false,
    showQRCode:false
})

//  此用户信息全局共享，具体包含了哪些信息，可以查看user实体类
const userObject = localStorage.getItem('user')
const user = JSON.parse(userObject)
const avatarUrl = baseURL + '/avatar-image/1/' + user.avatarUrl
user.registrationTime = dateFormat(user.registrationTime)
console.log(user);

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
function saveArticle() {
    articles.value.saveArticle = !articles.value.saveArticle
}
function likeArticle() {
  // 如果还没点赞，则点了之后赞数 +1 ，图标状态变为已点，否则相反
  if (articles.value.like === false){
    articles.value.numOfLike += 1
    articles.value.like = !articles.value.like
  }
  else{
    articles.value.numOfLike -= 1
    articles.value.like = !articles.value.like
  }
}
function dislikeArticle() {
  if (articles.value.dislike === false){
    articles.value.dislike = !articles.value.dislike
    articles.value.numOfDislike += 1
  }
  else{
    articles.value.dislike = !articles.value.dislike
    articles.value.numOfDislike -= 1
  }
}
function showComment() {
    articles.value.showComment = true
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
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
</script>
<template>
<div>
    <n-grid :cols="4">
        <n-gi :span="3" class="my-page">  
          <div>
            <n-card style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); ">
              <n-flex>
                <n-avatar
                round
                :size="70"
                :src= avatarUrl
                />
                <div class="nickname">{{ user.userName }}</div>
                <div style="margin-left: 500px">
                  <n-button color="#4cb7e6" @click="handleDeleteAccount">
                    <n-icon size="20"><MdPower></MdPower></n-icon>
                    <span style="margin-left: 10px">永久注销 </span>
                  </n-button>
                </div>

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
                    
                <div class="desc-num">{{ user.registrationTime }}
                </div>
            </n-flex>
          </n-card>
        </div>
            <!-- <n-divider style="width: 800px;"></n-divider> -->
            <div style="margin-top: 30px;">
   
              <n-card style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); ">
                <n-tabs type="line" animated>
                  <n-tab-pane name="文章" @click="showPreviewArticles('/my-page/articles')">
                    <div class="empty" v-if="false">
                      <n-result status="404" title="这个人没写过什么东西" description="可能肚子里没墨水">
                      </n-result>
                    </div>
                    <div class="not-empty" v-else>
                        <n-card :title="articles.title" :bordered="false">
                      <template #header-extra >
                        <n-avatar
                          round
                          :src="imgurl"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ articles.author }}</n-button>
                      </template>
                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div>
                        また、大学に入学してすぐ、学生寮から一番近い高校のグラウンドを探して自転車を走らせ、「野球の記者になりたいので取材させてください」と直談判して、高校野球の取材も始めました。それが1校目の取材先で、2校目以降は、東洋大学のOBが監督を務める高校に電話でアポイントメントを取り、取材先を増やしていきました。常時10校程度、1年間かけてチームの成長を追いました。高校野球というと春・夏の甲子園が注目されがちですが、私にとっては12月から2月にかけてのオフシーズンが見どころです。大会に向けたチーム作りや球児のありのままの姿を目にすることができるので、より深い記事が書けるんです。大学の4年間で50校近くの野球部を取材し、集めた情報をもとに3冊の書籍を出版しました。
                      </div>
                    </n-ellipsis>
                    <template #footer>
                      <!-- ------ 点赞 -->
                        <n-button text type="info" class="bottom-button" @click="likeArticle()">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="articles.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          {{ articles.numOfLike }}</n-button>
                          <!-- --------踩 -->
                          <n-button text class="bottom-button" color="black" @click="dislikeArticle()">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="articles.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          {{ articles.numOfDislike }}</n-button>

                          <!-- 评论 -->
                          <n-button text class="bottom-button" @click="showComment()">
                          <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular>
                          </n-icon>
                        </template>
                          235</n-button>
                          <n-modal v-model:show="articles.showComment">
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
                          <n-button text type="error" class="bottom-button" @click="saveArticle()">
                          <template #icon>
                          <n-icon>
                            <Heart16Filled v-if="articles.saveArticle"></Heart16Filled>
                            <Heart16Regular v-else></Heart16Regular>
                          </n-icon>
                        </template>收藏
                          </n-button>

                          <!-- 分享 -->
                          <n-button text class="bottom-button" @click="articles.showQRCode = true">
                          <template #icon>
                          <n-icon>
                            <MdPaperPlane ></MdPaperPlane>
                          </n-icon>
                        </template>分享
                        <n-modal v-model:show="articles.showQRCode">
                            <n-card
                              style="width: auto"
                              :bordered="false"
                              size="huge"
                              role="dialog"
                              aria-modal="true"
                            >
                              <n-qr-code
                              value="https://www.naiveui.com/"
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
                    </div>
                  
                </n-tab-pane>
                  <n-tab-pane name="点赞">
                    <div class="empty" v-if="true">
                      <n-result status="404" title="这个人不太喜欢赞同别人" description="这样不太好">
                      </n-result>
                    </div>
                    <div class="not-empty" v-else>
                    <n-card :title="articles.title" :bordered="false">
                      <template #header-extra >
                        <n-avatar
                          round
                          :src="imgurl"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ articles.author }}</n-button>
                      </template>
                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div>
                        また、大学に入学してすぐ、学生寮から一番近い高校のグラウンドを探して自転車を走らせ、「野球の記者になりたいので取材させてください」と直談判して、高校野球の取材も始めました。それが1校目の取材先で、2校目以降は、東洋大学のOBが監督を務める高校に電話でアポイントメントを取り、取材先を増やしていきました。常時10校程度、1年間かけてチームの成長を追いました。高校野球というと春・夏の甲子園が注目されがちですが、私にとっては12月から2月にかけてのオフシーズンが見どころです。大会に向けたチーム作りや球児のありのままの姿を目にすることができるので、より深い記事が書けるんです。大学の4年間で50校近くの野球部を取材し、集めた情報をもとに3冊の書籍を出版しました。
                      </div>
                    </n-ellipsis>
                    <template #footer>
                        <n-button text type="info" class="bottom-button" @click="likeArticle()">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="articles.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          赞{{ articles.numOfLike }}</n-button>
                          <n-button text class="bottom-button" @click="dislikeArticle()">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="articles.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          踩{{ articles.numOfDislike }}</n-button>
                          <n-button text>
                            <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular></n-icon>评论
                        </template>
                          </n-button>
                      </template>
                      
                  </n-card>
                    </div>
                  
                  </n-tab-pane>


                  <n-tab-pane name="收藏">
                    <div class="empty" v-if="true">
                      <n-result status="404" title="这个人没收藏过什么文章" description="可能不太喜欢">
                      </n-result>
                    </div>
                    <div class="not-empty" v-else>
                    <n-card :title="articles.title" :bordered="false">
                      <template #header-extra >
                        <n-avatar
                          round
                          :src="imgurl"
                          style="cursor: pointer;"
                          />
                          <n-button text strong style="margin-left: 10px;">{{ articles.author }}</n-button>
                      </template>
                      <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
                      <div>
                        また、大学に入学してすぐ、学生寮から一番近い高校のグラウンドを探して自転車を走らせ、「野球の記者になりたいので取材させてください」と直談判して、高校野球の取材も始めました。それが1校目の取材先で、2校目以降は、東洋大学のOBが監督を務める高校に電話でアポイントメントを取り、取材先を増やしていきました。常時10校程度、1年間かけてチームの成長を追いました。高校野球というと春・夏の甲子園が注目されがちですが、私にとっては12月から2月にかけてのオフシーズンが見どころです。大会に向けたチーム作りや球児のありのままの姿を目にすることができるので、より深い記事が書けるんです。大学の4年間で50校近くの野球部を取材し、集めた情報をもとに3冊の書籍を出版しました。
                      </div>
                    </n-ellipsis>
                    <template #footer>
                        <n-button text type="info" class="bottom-button" @click="likeArticle()">
                          <template #icon>
                          <n-icon>
                            <LikeFilled v-if="articles.like"></LikeFilled>
                            <LikeOutlined v-else></LikeOutlined>
                          </n-icon>
                        </template>
                          赞{{ articles.numOfLike }}</n-button>
                          <n-button text class="bottom-button" @click="dislikeArticle()">
                          <template #icon>
                          <n-icon>
                            <DislikeFilled v-if="articles.dislike"></DislikeFilled>
                            <DislikeOutlined v-else></DislikeOutlined>
                          </n-icon>
                        </template>
                          踩{{ articles.numOfDislike }}</n-button>
                          <n-button text>
                            <template #icon>
                          <n-icon>
                            <Comment16Regular></Comment16Regular></n-icon>评论
                        </template>
                          </n-button>
                      </template>
                      
                  </n-card>
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name="关注">
                    <div class="empty" v-if="true">
                      <n-result status="500" title="这个人还没有关注谁" description="你能成为被他想关注的人吗？">
                      </n-result>
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name="粉丝">
                    <div class="empty" v-if="true">
                      <n-result status="500" title="这个人没有一个粉丝" description="谁会是第一个呢？">
                      </n-result>
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