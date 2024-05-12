<template>
    <div >
        <n-grid x-gap="12" :cols="2">
            <n-gi class="login-form" style="width: 500px;margin-left: 200px;">             
                <div v-if="flag.register == 'register'">
                    <n-flex justify="center">

                      <n-modal v-model:show="showModal" :mask-closable="false">
                        <n-card
                            style="width: 600px"
                            title="请选择感兴趣的话题"
                            :bordered="false"
                            size="huge"
                            role="dialog"
                            aria-modal="true"
                        >
                          <n-flex>
                            <n-tag v-for="type in types" :key="type" type="info" class="report-reason" @click="addType(type)">
                              {{ type }}
                            </n-tag>
                          </n-flex>
                          <hr>
                          已选择：
<!--                          <n-tag type="info" class="report-reason" v-show="showSelect">-->
<!--                            {{ selectReason }}</n-tag>-->
                          <n-flex>
                            <n-tag v-for="type in selectedType" :key="type" type="success" class="report-reason">
                              {{ type }}
                            </n-tag>
                          </n-flex>
                          <template #footer>
                            <n-button :disabled="postDisable" type="info" block @click="postType()">开始你的阅读之旅</n-button>
                          </template>
                        </n-card>
                      </n-modal>
                        <div style="font-size: 30px;font-weight: bold;font-family: Dela,serif;">
                            非常感谢你有加入我们的想法
                        </div>
                        <n-form label-width="30" style="width:70%">        
                            <n-form-item
                            :validation-status="nicknameCheckOut.value.status"
                            :feedback="nicknameCheckOut.value.wordFeedback"
                            >               
                                <n-input v-model:value="nickname" clearable placeholder="昵称" class = "input">
                                    <template #prefix>
                                        <n-icon :component='Bot'/>
                                    </template>
                                </n-input>
                            </n-form-item>
                        </n-form>

                        <n-form label-width="30" style="width:70%">        
                            <n-form-item                     
                                :validation-status="emailValidation.value.status"
                                :feedback="emailValidation.value.wordFeedback"
                            >
                                <n-input 
                                v-model:value="email" 
                                clearable 
                                placeholder="邮箱" 
                                class = "input"
                                
                                >
                                    <template #prefix>
                                        <n-icon :component='Email'/>
                                    </template>
                                </n-input>
                               
                            </n-form-item>
                        </n-form>

                        <n-form label-width="30" style="width:70%">        
                            <n-form-item                 
                                :validation-status="passwordValidation.value.status"
                                :feedback="passwordValidation.value.wordFeedback"
                               
                            >
                                <n-input v-model:value="password" type="password" placeholder="密码" show-password-on="click" class = "input">
                                    <template #prefix>
                                        <n-icon :component='Locked'/>
                                    </template>
                                    
                                </n-input>
                            </n-form-item>
                            <!-- <n-date-picker v-model:value="timestamp" size="medium" type="date" style="margin-top: 30px;"></n-date-picker> -->
                            <n-radio-group size="large" v-model:value="gender" style="margin-top: 30px;">
                                <n-radio value="1" >男</n-radio>
                                <n-radio value="0" >女</n-radio>
                            </n-radio-group>
                            <!-- -------------------------------------- -->
                            <n-form-item                     
                            >
                                <n-input 
                                v-model:value="Captchas" 
                                clearable 
                                placeholder="请输入6位数的验证码"
                                class = "input"
                                style="margin-right: 5px;"
                                >
                                </n-input>
                                <n-button
                               @click="getCode()"
                               :disabled="flag.getCodeButtonDisable"
                                color="#5d97f5"
                                style="border-radius: 10px;"
                                >发送验证码({{ timeout }})
                            </n-button>
                               
                            </n-form-item>
                            
                            <!-- ------------------------------ -->
                            <n-button 
                            type="info" 
                            size="large" 
                            block round 
                            style="margin-top: 20px;" 
                            @click="register()">
                                注册
                            </n-button>
                            
                            <div>
                                已有账号？
                                <n-button text type="info" @click="flag.register = 'login'">立即登录</n-button>
                            </div>
                        </n-form>
                    </n-flex>
                </div>
<!-- ---------------登录页面 ---------->
                <div v-else-if="flag.register == 'login'" >
                    <n-flex justify="center">
                        <div style="font-size: 30px;font-weight: bold;font-family: Dela;width: 100%; text-align: center;">
                            请登录
                        </div>
                        <n-form label-width="30" style="width:70%">        
                            <!-- <n-form-item                     
                                :validation-status="emailValidation.value.status"
                                :feedback="emailValidation.value.wordFeedback"
                            > -->
                                <n-input v-model:value="email" clearable placeholder="邮箱" class = "input">
                                    <template #prefix>
                                        <n-icon :component='Email'/>
                                    </template>
                                </n-input>
                            <!-- </n-form-item> -->
                        </n-form>
                        <n-form label-width="30" style="width:70%;margin-top: 30px;">        
                                <n-input v-model:value="password" type="password" placeholder="密码" show-password-on="click" class = "input">
                                    <template #prefix>
                                        <n-icon :component='Locked'/>
                                    </template>
                                </n-input>
                            <n-button type="info" size="large" block round style="margin-top: 40px;" @click="login()">
                                登录
                            </n-button>
                            <div>
                                还没有账号？
                                <n-button text type="info" @click="flag.register = 'register'">点击注册</n-button>
                                <n-button text type="info" style="margin-left: 150px" @click="flag.register = 'changePassword'">忘记密码</n-button>
                            </div>
                        </n-form>
                    </n-flex>
                </div>

<!--              找回密码-->
              <div  v-else-if="flag.register=='changePassword'">
                <n-flex justify="center">
                  <div style="font-size: 30px;font-weight: bold;font-family: Dela;width: 100%; text-align: center;">
                    输入账号以找回密码
                  </div>
                  <n-form label-width="30" style="width:70%">
                    <n-form-item>
                      <n-input v-model:value="email" clearable placeholder="邮箱" class = "input">
                        <template #prefix>
                          <n-icon :component='Email'/>
                        </template>
                      </n-input>
                    </n-form-item>
                  </n-form>

                  <n-form style="width:70%">
                    <n-form-item>
                      <n-input v-model:value="password" type="password" placeholder="输入新密码" show-password-on="click" class = "input">
                        <template #prefix>
                          <n-icon :component='Locked'/>
                        </template>
                      </n-input>
                    </n-form-item>
                  </n-form>
                  <n-form style="width:70%">
                    <n-form-item>
                      <n-input
                          v-model:value="Captchas"
                          clearable
                          placeholder="请输入6位数的验证码"
                          class = "input"
                          style="margin-right: 5px;"
                      >
                      </n-input>
                      <n-button
                          @click="getCode()"
                          :disabled="flag.getCodeButtonDisable"
                          color="#5d97f5"
                          style="border-radius: 10px;"
                      >发送验证码({{ timeout }})
                      </n-button>
                    </n-form-item>
                    <n-button type="info" size="large" block round style="margin-top: 40px;" @click="changePassword()">
                      修改密码
                    </n-button>
                    <div>
                      <n-button text type="info" @click="flag.register = 'login'">立即登录</n-button>
                    </div>
                  </n-form>
                </n-flex>
              </div>
            </n-gi>
            <n-gi></n-gi>
        </n-grid>
    </div>
</template>

<script setup lang="ts">

import {
  NForm, NFormItem, NInput, NGrid, NGi, NIcon, NFlex, NButton, NRadio, NRadioGroup, useMessage, useDialog, NModal, NCard, NTag
} from 'naive-ui'
    import {
        computed,ref
    }from 'vue'
    import { useRouter } from 'vue-router';
    import {
        Email,Bot,Locked
    }  from '@vicons/carbon'
    import axios from 'axios';
    import {useIPStore} from "@/store/IPStore.ts";
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    // const timestamp = ref(null)
    const nickname = ref('')
    const gender = ref(0)
    // const data = ref('')
    const Captchas = ref('')
    // const baseURL = 'http://localhost:5173/api/'
    const flag = ref({
        register:'login',
        getCodeButtonDisable:false,
        changePassword:false
    })
    const countdownDuration = 60;
    const showModal = ref(false)
    const postDisable = ref(true)
    const types = [
      '编程',
      '新闻',
      '美食',
      '工作',
      '生活',
      '社会',
      '艺术',
      '娱乐',
      '旅行'
    ]
    const selectedType = ref([])
    function addType(type:string) {
      if (selectedType.value.includes(type)) {
        message.error('您已经添加了这个话题')
      }
      else {
        if (selectedType.value.length >= 1) {
          postDisable.value = false
        }
        if (selectedType.value.length > 2) {
          message.error('抱歉，最多只能选择三个话题')
          return
        }
        selectedType.value.push(type)
      }
    }
    function postType() {
      showModal.value = false
      // console.log("------------")
      // console.log(selectedType[0])
      // console.log('===========')
      router.push({
        name:'article-list',
        params:{
          type:selectedType.value[0],
          type1:selectedType.value[1],
          type2:selectedType.value[2]
        }
      })
    }
// 创建响应式变量用于存储剩余时间和控制按钮禁用状态
    const timeout = ref(countdownDuration); 
    let timer: number | null = null;

    const message = useMessage()
    const dialog = useDialog()
    function changePassword() {
      axios({
        method:'put',
        url:useIPStore().baseURL + 'user/change-password',
        data:{
          email:email.value,
          password:password.value,
          captcha:Captchas.value,
        },
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Authorization':token
        }
      })
          .then(function (resp) {
            if (resp.data.code == 0) {
              message.success('change successfully')
              flag.value.register = 'login'
              localStorage.removeItem('user')
              localStorage.removeItem('token')
            }
            else {
              message.error('sorry,try again later')
            }
          })
    }
    function getCode() {

        dialog.success({
          title: '发送成功',
          content: '验证码已发送，请及时在邮箱查看，如果没看到，可能要在垃圾箱找一下～',
          positiveText: '确定',
          negativeText: '返回',
        })
    
        axios({
            method:'post',
            url:useIPStore().baseURL + '/user/Captcha',
            data:{
                email:email.value
            },
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        // 如果定时器已存在，则清除
        if (timer) {
            clearInterval(timer);
        }

        // 设置剩余时间为总时长，并禁用按钮
        timeout.value = countdownDuration;
        flag.value.getCodeButtonDisable = true;

        // 启动定时器，每秒更新剩余时间
        timer = setInterval(() => {
            timeout.value -= 1;
            if (timeout.value === 0) {
            // 倒计时结束，清除定时器，并恢复按钮状态
            clearInterval(timer!);
            timer = null;
            timeout.value = countdownDuration;
            flag.value.getCodeButtonDisable = false;
            }
        }, 1000);
    }

    // function changePage() {
    //    flag.value.register = 'register'
    // }

    function login() {
        // const data:string = '';
        axios({
            method:'post',
            url:useIPStore().baseURL + '/user/login',
            data:{
                email:email.value,
                password:password.value
            },
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        })
        .then(function (resp) {
            if (resp.data.code === 1) {
                // console.log(email.value)
                // console.log(password.value);
                console.log(resp.data.data);
                message.error('邮箱或密码错误呢，请您再检查一下哦^_^')
            }
            else {
                message.success('登录成功！')
              let mapData = resp.data.data
             for( let key in  mapData) {
               console.log('key---'+key)
               console.log(mapData[key])
               let expireTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 三天后过期
               localStorage.setItem('token',key)
               localStorage.setItem('user',JSON.stringify(mapData[key]))
               localStorage.setItem('expireTime',expireTime.toString())
             }

                // console.log(resp.data.data)
                // localStorage.setItem('token',resp.data.data)

              // router.push({
              //   name:'article-list',
              //   params:{
              //     type:type
              //   }
              // })
                router.push({
                  name:'article-list',
                  params:{
                    type:'推荐',
                  }
                })
            }
        })

    }
    function register() {
      axios({
          method:'post',
          url:useIPStore().baseURL + '/user/register',
        // url:'/user/register',
          data:{
              userName:nickname.value,
              email:email.value,
              password:password.value,
              gender:gender.value,
              captcha:Captchas.value
          },
          headers: {
              // 这里有个坑，post请求默认以json形式发送数据，如果后端没有一个相应的类接收，并且加上@requestBody，则返回500
              // 如果指定请求头如下，则后端可以一个一个参数地分别接收。
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      })
      .then(function (resp) {
          if (resp.data.code === 1) {
              console.log(resp.data.code + '111');
              message.error('输入的数据有误，请您再检查一下哦^_^')
          }
          else if (resp.data.code === 2) {
              console.log(resp.data.code + '222');
              message.error('抱歉呢，此邮箱已被占用')
          }
          else {
            // showModal.value = true
            message.success('注册成功！')
            showModal.value = true
            let mapData = resp.data.data
            for( let key in  mapData) {
              let expireTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 三天后过期
              localStorage.setItem('token',key)
              localStorage.setItem('user',JSON.stringify(mapData[key]))
              localStorage.setItem('expireTime',expireTime.toString())
            }
            // router.push({
            //   name:'article-list',
            //   params:{
            //     type:'编程'
            //   }
            // })
        }
      })
    }
// 邮箱验证函数
    function validateEmailStatus(email: string) {
    // 正则表达式用于验证邮箱格式
    const emailRegex = new RegExp (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const validation_result = ref({status:'',wordFeedback:''})
    // 使用 test() 方法验证邮箱格式是否正确
    if (email.length === 0){
        validation_result.value.status = 'error'
        validation_result.value.wordFeedback = '请输入一个邮箱地址'
        return validation_result
    }
    else {
        if (emailRegex.test(email)) {
            validation_result.value.status = 'undefined'
            validation_result.value.wordFeedback = '邮箱格式正确'
            // return 'undefined'
            return validation_result
            } 
        else {
            validation_result.value.status = 'warning'
            validation_result.value.wordFeedback = '这不是一个正确的邮箱,你可以保持这样,但你可能无法收到验证码注册'
            return validation_result
            }
    }
}
// 登录时的邮箱验证提示

// 密码验证函数
    function validatePasswordStatus (password: string) {
        const validation_result = ref({status:'',wordFeedback:''})
        const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);
        if (password.length === 0) {
            validation_result.value.status = 'error'
            validation_result.value.wordFeedback = '输入一串你能记住的符号'
            return validation_result
        }          
        else if (password.length > 0 && password.length < 8) {
            validation_result.value.status = 'warning'
            validation_result.value.wordFeedback = '请你最少输入8位'
            return validation_result
        }
        else {
            if (!passwordRegex.test(password)){
                validation_result.value.status = 'warning'
                validation_result.value.wordFeedback = '我们建议你使用大小写字母加数字的组合'
                return validation_result
            }
            else {
                validation_result.value.status = 'undefined'
                validation_result.value.wordFeedback = '这个密码很好'
                return validation_result
            }
        }
        
    }

// 邮箱，密码验证的计算属性，根据返回验证结果显示不同的提示状态，在模板中使用需要加.value
    const emailValidation = computed(() => {
            return validateEmailStatus(email.value)
        })
    const passwordValidation = computed(() => {
            return validatePasswordStatus(password.value)
        })
    const nicknameCheckOut = computed(() => {
        return nicknameCheck(nickname.value)
    })
// 昵称检查函数
function nicknameCheck(nickname:string) {
    const validation_result = ref({status:'',wordFeedback:''})
    if (nickname.length === 0) {
        validation_result.value.status = 'error'
        validation_result.value.wordFeedback = '取个有意义的名字'
    }
    else {
        validation_result.value.status = 'undefined'
        validation_result.value.wordFeedback = '这个名字太棒了'
    }
    return validation_result
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap') */

    .login-form{
        border-radius: 18px;
        padding: 50px;
        background: inherit;
        overflow: hidden;
        /* background-color: #FBEAEB; */
        /* background-color:rgba(251, 234, 235,0.5); */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); 
        /* opacity: 0.5; */
    }
    .input{
        border-radius: 10px;
    }


</style>