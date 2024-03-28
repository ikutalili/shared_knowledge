<script setup lang="ts">

import {NButton, NDropdown, NEllipsis, NFlex, NTable, NTabPane, NTabs, useMessage,useDialog} from "naive-ui";
import axios from 'axios'
import {ref,computed} from "vue";

interface User {
  userId: number;
  userName: string;
  gender: number;
  email: string;
  following: number;
  followed: number;
  role: string;
  reported: number;
  reportReason:string;
  numOfArticles: number;
  numOfSaves: number;
  registrationTime: Date;
}
interface Article {
  articleId: string;
  authorName: string;
  articleTitle: string;
  articleType: string;
  numOfLikes: number;
  numOfDislikes: number;
  numOfSaves: number;
  numOfComments: number;
  reported:number;
  reportReason:string;
  publishTime: Date;
}
interface Comment {
  commentId: number;
  userId: number;
  userName: string;
  comment: string;
  numOfLikes: number;
  numOfDislikes: number;
  reported: number;
  reportReason:string;
  commentTime: Date; // TypeScript中使用Date类型代替Java的Timestamp
}

const message = useMessage()
const dialog = useDialog()
const baseURL = 'http://localhost:5173/api/'
const userUrl = baseURL + 'user/get-all-users'
const articleUrl = baseURL + 'articles/display-all-articles'
const flcommentUrl = baseURL + 'display-flcomments'
const slcommentUrl = baseURL + 'display-slcomments'
const users = ref<User[]>([])
const articles = ref<Article[]>([])
const flcomments = ref<Comment[]>([])
const slcomments = ref<Comment[]>([])
async function fetchData<T>(url:string):Promise<T> {
  try {
    const response = await axios.get(url)
    if (response.data.code === 0) {
      return response.data.data
    }
    else {
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
axios.get(userUrl)
    .then(function (resp) {
      if (resp.data.code === 0) {
        users.value = resp.data.data
        // console.log(users.value)
      }
      else {
        message.error('error')
      }
    })
// users.value = await fetchData<User[]>(userUrl)
// console.log(users.value)
const showReported = ref(0)
const filteredUsers = computed<User[]>(() => {
  if (showReported.value ==  0) {
    return users.value.filter(user => user.reported == 0)
  }
  else if (showReported.value ==  1) {
    return users.value.filter(user => user.reported == 1)
  }
  else {
    return users.value
  }
})

const options = [
  {
    label:'正常用户',
    key:0
  },
  {
    label:'被举报用户',
    key:1
  },
  {
    label:'全部用户',
    key:2
  }
]
function handleSelect (key: number) {
  showReported.value = key
  message.success('已为您筛选'+options[key].label)
}
function lockUser (id,name) {
  dialog.warning({
    title: '警告',
    content: '你将删除 『'+name+'』 的账号,确定吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      message.success('已永久删除该用户的账号')
      axios.put(baseURL + 'user/delete-user/' + id+ '?adminCode=' + user.role)
    },
    onNegativeClick: () => {
      message.error('已取消')
    }
  })
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
              getData('文章管理')
            }else {message.error('删除失败，请稍候再试')}
          })
      console.log(id)

    },
    onNegativeClick: () => {
      message.error('已取消')
    }
  })
}
function deleteComment(which:number,id:number,comment:string) {
  dialog.warning({
    title: '警告',
    content: '你将删除 『'+comment+'』 这条评论',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      axios({
        method:'delete',
        url:baseURL + 'delete-comment/' + which +'/' + id
      })
          .then(function (resp) {
            if (resp.data.code == 0) {
              message.success('已删除该评论')
              getData('评论管理')
            }
            else {
              message.error('删除失败，请稍候再试')
            }
          })
    },
    onNegativeClick: () => {
      message.error('已取消')
    }
  })
}
async function getData(name: string) {
  switch (name) {
    case '用户管理':
      users.value = await fetchData<User[]>(userUrl)
        if (users.value == null) {message.error('cannot get data for ' + name)}
      break
    case '文章管理':
      articles.value = await fetchData<Article[]>(articleUrl)
        if (articles.value == null) {message.error('cannot get data for ' + name)}
      break
    case '评论管理':
      flcomments.value = await fetchData<Comment[]>(flcommentUrl)
      slcomments.value = await fetchData<Comment[]>(slcommentUrl)
        if (flcomments.value == null || slcomments.value == null) {message.error('cannot get data for ' + name)}
      break
  }
  return true
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
<n-flex>
  <n-tabs type="line" animated size="large" @before-leave="getData">
    <n-tab-pane name="用户管理" tab="用户管理" >
      <n-table :bordered="false" :single-line="false">
        <thead>
        <tr>
          <th>用户ID</th>
          <th>用户名</th>
          <th>性别</th>
          <th>邮箱</th>
          <th>关注</th>
          <th>粉丝</th>
          <th>角色</th>
          <th>被举报</th>
          <th>注册时间</th>
          <th>操作</th>
          <th>
            <n-dropdown trigger="hover" :options="options" placement="bottom-start" @select="handleSelect">
              <n-button type="info" text>筛选</n-button>
            </n-dropdown>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in filteredUsers" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.gender == 0 ? '女' : '男' }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.following }}</td>
          <td>{{ user.followed }}</td>
          <td :style="{ fontWeight: user.role == '1' ? 'normal' : 'bold' }">{{ user.role == '1' ? '普通用户' : '管理员' }}</td>
          <td>{{ user.reported == 0 ? '否' : '是' }}</td>
          <td>{{ dateFormat(user.registrationTime) }}</td>
          <td>
              <n-button text style="font-weight: bold;color:#ff69b4;" @click="lockUser(user.userId,user.userName)">
                禁用
              </n-button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-tab-pane>
    <n-tab-pane name="文章管理" tab="文章管理" >
      <n-table :bordered="false" :single-line="false">
        <thead>
        <tr>
          <th>文章ID</th>
          <th>作者</th>
          <th>标题</th>
          <th>分类</th>
          <th>点赞</th>
          <th>点踩</th>
          <th>收藏</th>
          <th>评论</th>
          <th>被举报</th>
          <th>举报原因</th>
          <th>发布时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="article in articles" :key="article.articleId">
          <td>{{ article.articleId }}</td>
          <td>{{ article.authorName }}</td>
          <td>{{ article.articleTitle }}</td>
          <td>{{ article.articleType }}</td>
          <td>{{ article.numOfLikes }}</td>
          <td>{{ article.numOfDislikes }}</td>
          <td>{{ article.numOfSaves }}</td>
          <td>{{ article.numOfComments }}</td>
          <td>{{ article.reported == 0 ? '否' : '是' }}</td>
          <td>{{ article.reportReason }}</td>
          <td>{{ dateFormat(article.publishTime) }}</td>
          <td >
            <n-button text style="font-weight: bold;color:#ff69b4;" @click="deleteArticle(article.articleId,article.articleTitle)">
              删除
            </n-button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-tab-pane>
    <n-tab-pane name="评论管理" tab="评论管理">
      <n-table :bordered="false" :single-line="false">
        <thead>
        <tr>
          <th>评论ID</th>
          <th>用户名</th>
          <th>评论内容</th>
          <th>点赞</th>
          <th>点踩</th>
          <th>被举报</th>
          <th>举报原因</th>
          <th>评论时间</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="comment in flcomments" :key="comment.commentId">
          <td>{{ comment.commentId }}</td>
          <td>{{ comment.userId }}</td>
          <td>
            <n-ellipsis style="max-width: 240px">
              {{ comment.comment }}
          </n-ellipsis></td>
          <td>{{ comment.numOfLikes }}</td>
          <td>{{ comment.numOfDislikes }}</td>
          <td>{{ comment.reported == 0 ? '否' : '是' }}</td>
          <td>{{ comment.reportReason }}</td>
          <td>{{ dateFormat(comment.commentTime) }}</td>
          <td >
            <n-button text style="font-weight: bold;color:#ff69b4;" @click="deleteComment(1,comment.commentId,comment.comment)">
              删除
            </n-button>
          </td>
        </tr>

        <tr v-for="comment in slcomments" :key="comment.commentId">
          <td>{{ comment.commentId }}</td>
          <td>{{ comment.userId }}</td>
          <td>
            <n-ellipsis style="max-width: 240px">
              {{ comment.comment }}
            </n-ellipsis></td>
          <td>{{ comment.numOfLikes }}</td>
          <td>{{ comment.numOfDislikes }}</td>
          <td>{{ comment.reported == 0 ? '否' : '是' }}</td>
          <td>{{ comment.reportReason }}</td>
          <td>{{ dateFormat(comment.commentTime) }}</td>
          <td >
            <n-button text style="font-weight: bold;color:#ff69b4;" @click="deleteComment(2,comment.commentId,comment.comment)">
              删除
            </n-button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-tab-pane>
  </n-tabs>
</n-flex>
</template>

<style scoped>

</style>