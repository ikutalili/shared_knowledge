import { defineStore } from "pinia";
import {ref} from 'vue'
export const useSideContentStore = defineStore('SideContent',{
    state:() => {
        return {
            show:ref(true)
        }
    },
    
})