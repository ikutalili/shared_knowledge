<script setup lang="ts">
import { NAvatar,NGi,NGrid,NFlex,NCard,NDivider,NTabs,NTab,NIcon,NButton,NEllipsis,NModal,NTabPane } from 'naive-ui';
import { ref } from 'vue';
import imgurl from '../imgs/Tokyo.jpg'
import {LikeOutlined,DislikeOutlined,LikeFilled,DislikeFilled} from "@vicons/antd"
import {Comment16Regular} from "@vicons/fluent"
const myPage = {
    nickname:'水野',
    following:123,
    followed:20,
    key:[1,2,3],
    
}
const article = {
    like:ref(false),
    dislike:ref(false)
}
function likeArticle() {
    article.like.value = !article.like.value
}
function dislikeArticle() {
    article.dislike.value = !article.dislike.value
}
</script>
<template>
    <n-card title="君に会いたい" :bordered="false">
        <template #header-extra >
        <n-avatar
            round
            :src="imgurl"
            style="cursor: pointer;"
            />
            <n-button text strong style="margin-left: 10px;">水野</n-button>
        </template>
        <n-ellipsis :line-clamp="2" :tooltip="false" expand-trigger="click" class="preview-text">
        <a>
        また、大学に入学してすぐ、学生寮から一番近い高校のグラウンドを探して自転車を走らせ、「野球の記者になりたいので取材させてください」と直談判して、高校野球の取材も始めました。それが1校目の取材先で、2校目以降は、東洋大学のOBが監督を務める高校に電話でアポイントメントを取り、取材先を増やしていきました。常時10校程度、1年間かけてチームの成長を追いました。高校野球というと春・夏の甲子園が注目されがちですが、私にとっては12月から2月にかけてのオフシーズンが見どころです。大会に向けたチーム作りや球児のありのままの姿を目にすることができるので、より深い記事が書けるんです。大学の4年間で50校近くの野球部を取材し、集めた情報をもとに3冊の書籍を出版しました。
        </a>
    </n-ellipsis>
    <template #footer>
        <n-button text type="info" class="bottom-button" @click="likeArticle()">
            <template #icon>
            <n-icon>
            <LikeFilled v-if="article.like.value"></LikeFilled>
            <LikeOutlined v-else></LikeOutlined>
            </n-icon>
        </template>
            赞{{ myPage.following }}</n-button>
            <n-button text class="bottom-button" @click="dislikeArticle()">
            <template #icon>
            <n-icon>
            <DislikeFilled v-if="article.dislike.value"></DislikeFilled>
            <DislikeOutlined v-else></DislikeOutlined>
            </n-icon>
        </template>
            踩{{ myPage.following }}</n-button>
        </template>
    </n-card>
</template>
<style scoped>

</style>