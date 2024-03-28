<script setup lang="ts">
import { quillEditor } from 'vue3-quill';
import {reactive,ref,nextTick} from 'vue'
import {NButton, NInput, NSpace, NTag, useMessage} from 'naive-ui';
import type { UploadInst, UploadFileInfo } from 'naive-ui'
  // components: {
  //   quillEditor
  // }

  const uploadRef = ref<UploadInst | null>(null)
  // const upload = uploadRef.value
  
  const fileListLengthRef = ref(0)
  // const fileListLength = fileListLengthRef.value
  const handleChange = (options: { fileList: UploadFileInfo[] }) => {
        fileListLengthRef.value = options.fileList.length
      }
  const handleClick = () => {
        // uploadRef.value?.submit()
        console.log(uploadRef.value);
      }


  const state = reactive({
      title: '',
      content: '',// 编辑器的文本值已经绑定了这个变量
      preview:'',
      editorOption: {
        placeholder: '分享你的想法...',
        // formats: ['br'],
        modules: {
          clipboard: {
            matchVisual: false
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            // [{ font: ['微软雅黑', '宋体', '华文黑体'] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
      ],
     
      },
        
    },
      disabled: false
    })

    const onEditorBlur = (quill) => {
      console.log('editor blur!', quill)
    }
    const onEditorFocus = (quill) => {
      console.log('editor focus!', quill)
    }
    const onEditorReady = (quill) => {
      console.log('editor ready!', quill)
    }
    const onEditorChange = ({ quill, html, text }) => {
    //   console.log('editor change!', quill, html, text)
    // console.log(html)
    // state._content = html
    console.log(state.content)
      
    }
const userObject = localStorage.getItem('user')
const user = ref(JSON.parse(userObject))

// 文件下载弹出下载按钮函数
    const test = () => {
      // alert("hey")
      axios({
        method:'get',
        url:'http://localhost:5173/api/downloadFile',
        responseType:'blob',
      }).then((resp)=>{
        // create file link in browser's memory
        const href = URL.createObjectURL(resp.data)
         // create "a" HTML element with href to file & click
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download','file.jpg')
        document.body.appendChild(link)
        link.click()
// clean up "a" element & remove ObjectURL
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
      console.log(state.title)
    }
    //设置一个时间或者一个事件，让编辑器处于只读状态
    setTimeout(() => {
      state.disabled = false
    }, 2000)
    const message = useMessage()
    const type = ref('编程')
    const options = [
        {
          label: '编程',
          key:1
        },
        {
          label: '新闻',
          key: 2
        },
        {
          label: '美食',
          key: 3
        },
        {
          label: '工作',
          key: 4
        },
        {
          label: '生活',
          key: 5
        },
        {
          label: '社会',
          key: 6
        },
        {
          label: '艺术',
          key: 7
        },
        {
          label: '娱乐',
          key: 8
        },
        {
          label: '旅行',
          key: 9
        }
     
      ]
      const _key = ref(0)

      function handleSelect (key: string | number) {    
        const topicKey = Number(key) - 1
        _key.value = topicKey
        message.success('已选择'+options[topicKey].label)
        type.value = options[topicKey].label
        console.log(options[topicKey].label)
      }
    
import {
  NGrid,NGi,NUpload,NDropdown,NFlex
} from 'naive-ui'
import axios from 'axios'

// 发布文章，即把文章存到服务器上
async function publish(){
  await axios({
    method:'post',
    headers:{
      // 'Content-Encoding':'utf-8',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url:'http://localhost:5173/api/save-article',
    data:{
      id:user.value.userId,
      name:user.value.userName,
      avatar:user.value.avatarUrl,
      title:state.title,
      type:type.value,
      article:state.content,
      preview:state.preview
    },
  })
  .then(function (resp) {
    if (resp.data.code === 0) {
      message.success('成功！！')
      uploadRef.value?.submit()
    }
    else {
      message.error('error')
    }
  })
  
}
</script>
<template>
    <div>
      <n-grid :cols="4">
            <n-gi :span="3" class="writing-panel">
              <!-- <h1>标题</h1>             -->
              <div>                     
                  <!-- <n-input
                  v-model:value="state.title" 
                  type="text" 
                  placeholder="起个好题目吧" 
                  class="title-input"
                  />                                   -->
                  <input class="title-input" placeholder="此处输入标题" v-model="state.title">
                
              </div>
              <!-- <h1>正文</h1> -->
              <div style="margin-top: 50px;">
                <quillEditor
                class="editor"
                style="height: 500px;"
                v-model:value="state.content"
                :options="state.editorOption"
                :disabled="state.disabled"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)"
                
    />
              </div>
              <div>
                <h4>添加文章描述:</h4>
                <n-input
                    v-model:value="state.preview"
                    type="textarea"
                    placeholder="用一句话简短地描述你的文章，不超过50字。"
                />
              </div>
              <div class="cover-image-upload" style="margin-top: 20px;">
                <h4>添加封面：</h4>
                <n-upload
                action="http://localhost:5173/api/upload-article-image/1"          
                list-type="image-card"        
                multiple
                type="image"
                ref="uploadRef"
                :max="1"
                :default-upload="false"
                @change="handleChange"
           >   
                </n-upload>
                 图片上传格式支持 JPEG、JPG、PNG 
              </div>
              
              <div class="category">
                <h4>请为文章添加分类(默认编程)：</h4>
                <n-flex>
                    <n-dropdown trigger="hover" :options="options" @select="handleSelect" size="small">
                      <n-button dashed size="small">选出一个话题</n-button>
                    </n-dropdown>                  
                    <n-space style="margin-left: 30px;">                  
                      <n-tag type="success">
                        {{options[_key].label}}
                      </n-tag>
                </n-space>
                </n-flex>
                
              </div>
              <div style="margin-top: 40px;">
<!--                <n-button -->
<!--                type="info"-->
<!--                 @click="handleClick()"-->
<!--                 >存入草稿</n-button>-->

                <n-button 
                type="info" 
                style="margin-left: 20px; width: 90px;" 
                @click="publish()"
                :disabled="!fileListLengthRef"
                >发布</n-button>
                              
              </div>
            </n-gi>
            <n-gi>
            </n-gi>
        </n-grid>
  </div>
    
   

</template>
<style scoped>
.writing-panel {
  border-radius: 18px;
  padding: 50px;
  background: inherit;
  overflow: hidden;
  /* background-color: #FBEAEB; */
  background-color: #F6F6F6;
  /* background-color:rgba(251, 234, 235,0.5); */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}
.editor{
  font-size: 20px;
  font-family: '微软雅黑', '宋体', '华文黑体', sans-serif;
}
.title-input{
  width: 100%;
  font-size: 30px;
  font-family: '微软雅黑', '宋体', '华文黑体';
  font-weight: bold;
  background: inherit;
  border: none;
  /* border-bottom: 1px solid rgb(187, 180, 180); */
  outline: none;
  text-align: center;
}
img {
  height: 250px;
  width: 450;
}
</style>