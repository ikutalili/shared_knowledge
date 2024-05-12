import { defineStore } from "pinia";
// import {ref} from 'vue'
// const url = 'http://192.168.163.1:5173'
// const url2 = 'http://192.168.163.1:8080'
const url = 'http://' +  window.location.hostname + ':5173'
const url2 = 'http://' + window.location.hostname + ':8080'
const currentUrl: string = window.location.href;
export const useIPStore = defineStore('IP',{

    state:() => {
        return {
            // show:ref(true)
            currentUrl:currentUrl,
            baseURL:url + '/api',
            coverURL:url2 + '/avatar-image/2/',
            avatarURL:url2 + '/avatar-image/1/'
        }
    },

})