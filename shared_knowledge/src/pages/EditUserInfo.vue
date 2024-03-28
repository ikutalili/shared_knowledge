<script setup lang="ts">
import {
  NInput, NFlex, NCard, NButton, NAvatar, NUpload, useDialog, useMessage, useLoadingBar, NIcon
} from 'naive-ui'
import {GenderFemale,GenderMale} from '@vicons/carbon'
import {ref,watch,onMounted,nextTick} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
let userObj = localStorage.getItem('user')
let user = ref(JSON.parse(userObj))
// user是一个RefImpl对象，user.value 是一个Proxy原生js对象
console.log(user);
const loading = useLoadingBar()
const router = useRouter()
const dialog = useDialog()
const message = useMessage()
const passwordChange = ref(false);
const passwordButtonDisable = ref(true)
const sendCodeButton = ref(false)
const captchaShow = ref(false)
const baseURL = 'http://localhost:5173/api/'
const uploadPath = baseURL + 'upload/' + user.value.userId
console.log('user-id-->'  + user.value.userId)
const avatarUrl = ref('http://localhost:8080/avatar-image/1/' + user.value.avatarUrl)
// console.log('url-->' + avatarUrl.value);
console.log(user.value.userId);
let timeout = ref(60)
const userInfo = ref({
    userName:user.value.userName,
    profile:'',
    email:user.value.email,
    password:'',
    captcha:'',
})

function sendCode() {
    
    let timer: number | null = null;
    // 如果定时器已存在，则清除
    if (timer) {clearInterval(timer);}
        // 设置剩余时间为总时长，并禁用按钮
        sendCodeButton.value = true;
        // 启动定时器，每秒更新剩余时间
        timer = setInterval(() => {
            timeout.value -= 1;
            if (timeout.value === 0) {
            // 倒计时结束，清除定时器，并恢复按钮状态
            clearInterval(timer!);
            timer = null;
            timeout.value = 60;
            sendCodeButton.value = false;
            }
        }, 1000);

    axios({
        method:'post',
        url:baseURL + 'user/Captcha',
        data:{
            email:user.value.email
        },
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then( function (resp ){
        if (resp.data.code === 0) {
            message.success('发送成功！请注意在邮箱中查看')
            console.log('发送验证码的邮箱是：' + user.value.email);
        }
        else {
            message.error('网络错误，请重试')
        }
    } )
   
}
function changePassword() {
        dialog.success({
        title: '提示',
        content: '如果你要修改密码，我们将需要发送一封邮件信息认证你是否本人在操作',
        positiveText: '好的',
        negativeText: '算了',
        onPositiveClick: () => {
            captchaShow.value = true
            passwordButtonDisable.value = false
          },
    })
}
function save() {
    
    //  对输入值进行检查，如果名字长度太长不合法，返回；如果密码长度不符合区间，返回；输入格式正确，发送请求。
    if (userInfo.value.userName.length >= 50) {
        message.error('名字长度太长了哦～')
        return
    }
    else if (userInfo.value.userName.length === 0) {
        message.error('名字不能为空')
        return
    }
    else if ( passwordChange.value && (userInfo.value.password.length < 8 || userInfo.value.password.length >= 16)  ) {
        console.log(userInfo.value.password.length)
        message.error('抱歉，密码长度应为 8-16 位')
        return 
    }
    else if (passwordChange.value && userInfo.value.captcha.length === 0  ) {
        console.log(userInfo.value.captcha.length)
        message.error('请输入验证码')
        return 
    }
    //  如果没动过密码，初始化密码为null，或者点了按钮，但密码长度不符合要求
    else if (userInfo.value.password == '' || (passwordChange.value && userInfo.value.password.length >= 8 && userInfo.value.password.length <= 16 ) ) {
        loading.start()
        // const token  = localStorage.getItem('token')
        axios({
        method:'put',
        url:baseURL + 'user/updateInfo',
        data:{
            userName:userInfo.value.userName,
            password:userInfo.value.password,
            captcha:userInfo.value.captcha,
            profile:userInfo.value.profile
        },
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Authorization':token
        }
    })
    .then(function (resp) {
        if (resp.data.code === 0) {
            loading.finish()
            message.success('保存成功！')
            // 如果改过密码后，需要跳转登录页面重新登录
            if (userInfo.value.password != '') {
                router.push({
                    path:'/login'
                })
                // const userData = JSON.stringify(resp.data.data)
                // localStorage.setItem('user',userData)
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
            else {
                const userData = JSON.stringify(resp.data.data)
                localStorage.setItem('user',userData)
                // user.value.avatarUrl = resp.data.data.avatarUrl
                // 如果硬要改变整个user信息，即让它变成响应式的，就只能重新从localStorage里面获取对象，再赋值一次
                avatarUrl.value = 'http://localhost:8080/avatar-image/1/' + resp.data.data.avatarUrl
                // console.log('resp.data--> 222' + user.value.avatarUrl)
            }
        }
        else {
            message.error('抱歉，似乎出了点问题')
            console.log('userName' + userInfo.value.userName);
            console.log('password' + userInfo.value.password);
            console.log('captcha' + userInfo.value.captcha);
        }
    })

    }

}

    watch(
      () => userInfo.value.password,
      () => {
        // console.log(`密码发生了变化，新密码为 ${newValue}，旧密码为 ${oldValue}`);
        passwordChange.value = true
      }
    );

// const token = localStorage.getItem('token')
// async function updateAvatar() {
    // localStorage.setItem('user',JSON.stringify(user))

    // await checkUserLoggedIn();
    // await axios({
    //           url:baseURL + 'user/checkUserLoggedIn',
    //           headers:{
    //             'Authorization':token
    //           }
    //         })
    //         .then(function(resp) {
    //           // 若token不过期，登录成功
    //           if (resp.data.code === 0) {
    //             message.success('头像更新成功！')
                
    //             localStorage.setItem('user',JSON.stringify(resp.data.data))
    //             user.value.avatarUrl = resp.data.data.avatarUrl
    //             console.log(user.value.avatarUrl)
    //         }
    //         else {
    //             message.error('头像更新失败')
    //         }
    //     }
    //         )
              
            
    // console.log(user.value);
    
    // let userObj = localStorage.getItem('user')
    // user.value = JSON.parse(userObj)
// }
</script>
<template>


    <n-card class="panel" style="margin-left: 100px;">

    <div style="text-align: center;">
        <h1>我的信息</h1>
    </div>
    <div >
        <n-flex style="font-size: 20px;margin-left: 190px;margin-top: 30px;">
            <div>
                头像
            </div>
            <div style="margin-left: 20px;">
                <n-avatar
                    round
                    size="large"
                    :src=avatarUrl
                    />

            </div>
            <div style="margin-left: 30px;">
                <n-upload 
                :action = uploadPath
                >
                <n-button type="info" text size="large">
                    修改新头像
                </n-button>
            </n-upload>
            </div>
          <div style="margin-left: 70px">
            <n-icon v-if="user.gender == 0" color="pink" :size="30">
              <GenderFemale/>
            </n-icon>
            <n-icon v-if="user.gender == 1" color="lightblue" :size="30">
              <GenderMale/>
            </n-icon>
          </div>

        </n-flex>

    </div>
        <div >
        <div style="font-size: 20px;margin-top: 30px;">
            <n-flex style="justify-content: center;">
                <div>
                    昵称：
                </div>
                <div>
                    <n-input v-model:value="userInfo.userName" 
                    type="text" 
                    class="input"
                    />
                </div>

            </n-flex>
<!--          <div class="gender" style="margin-left: 190px;margin-top: 30px">-->
<!--            性别：女-->
<!--          </div>-->
          <n-flex style="margin-top: 30px;justify-content: center;">
            <div>
              简介：
            </div>
            <div>
              <n-input v-model:value="userInfo.profile"
                       type="textarea"
                       class="input"
                       size="tiny"
                       placeholder="用一句话介绍你自己"
              />
            </div>
          </n-flex>
            <n-flex style="margin-top: 30px;justify-content: center">
                <div>
                    邮箱：
                </div>
                <div>
                  <n-input v-model:value="userInfo.email"
                           type="text"
                           class="input"
                           :disabled="true"
                  />
                </div>
            </n-flex>
            <n-flex style="margin-top: 30px;justify-content: center;">
                <div style="margin-left: 40px;">
                    密码：
                </div>
                     <div>
                    <n-input v-model:value="userInfo.password" 
                    show-password-on="click"
                    type="password" 
                    placeholder='****** (未修改)'
                    :disabled=passwordButtonDisable
                    class="input"
                    />
                </div>
                <div>
                    <n-button type="info" text @click="changePassword()">修改</n-button>
                </div>
               
            </n-flex>
            <n-flex style="margin-top: 30px;justify-content: center; margin-left: 58px;" v-show="captchaShow">
                <div>
                    验证：
                </div>
                <div>
                    <n-input v-model:value="userInfo.captcha" 
                    type="text" 
                    placeholder='请输入收到的验证码'
                    class="input"
                    />
                </div>
                <div>
                    <n-button 
                    type="info" 
                    text 
                    @click="sendCode()"
                    :disabled="sendCodeButton"
                    >
                    发送({{ timeout }})</n-button>
                </div>
            </n-flex>
            <n-flex style="margin-top: 20px;justify-content: center;">
                
                <n-button 
                type="info"
                :bordered="false"
                style="width: 200px;"
                @click="save()"
                >
                    保存
                </n-button>
            </n-flex>
        </div>
    </div>
    </n-card>
    
</template>
<style scoped>
.panel{
    width: 800px;
    height: 580px;
    border-radius: 18px;
    /* background-color: #FFE2E2; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}
.input{
    border-radius: 5px;
    width: 300px;
}
</style>