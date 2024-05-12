import { defineStore } from "pinia"
// import {ref} from 'vue'
import axios from 'axios'
export interface Article {
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

// const articles = ref<Article[]>([]) // ts泛型
export const useHeadContentStore = defineStore('HeadContent',{
    state()  {
        return {
            articles:null as Article || null,
            // flag:false
        }
    },
    actions: {
        searchArticle(keyword:string) {
            // this.articles = {}
            axios({
                url:'http://localhost:5173/api/articles/search/' + keyword,
                data:{
                    keyword:keyword
                }
            })
                .then(resp => {
                    if (resp.data.code == 0) {
                        this.articles = resp.data.data as Article
                        console.log('ok')
                        // console.log(this.articles)
                    }
                    else {
                        console.log('search article error...')
                    }
                })
        }
    }
})