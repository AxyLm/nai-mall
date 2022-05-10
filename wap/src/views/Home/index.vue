<template>
  <div>
     <layout title="首页">
       <div class="home-search">
            <van-icon name="search" />
            <p>输入您要搜索的宝贝..</p>
            <img src="@/assets/imgs/home-msg.png" alt="">
        </div>
        <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item></van-swipe-item>
            <van-swipe-item></van-swipe-item>
            <van-swipe-item></van-swipe-item>
            <van-swipe-item></van-swipe-item>
        </van-swipe>
     </layout>
  </div>
</template>

<script>
export default {
    name:"home",
}
</script>

<style lang="less" scoped>
 /* 搜索区域  */ 
    .home-search{
        background-color: #fff;
        display: flex;
        height: 88px;
        line-height: 88px;
        font-size: 28px;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
    }
    .home-search i{
        color: @gray-6;
        font-size: 40px;
        width: 40px;
    }
    .home-search p{
        color: @gray-5;
        flex: 1;
        margin: 0 34px 0 10px;
        border-right: 1px solid @border-color;
    }
    .home-search img{
        width: 46px;
    }
    /* 轮播图样式 */ 
    .home-swipe .van-swipe-item {
        height: 400px;
        background-color: #39a9ed;
    }
    .home-swipe .van-swipe-item:nth-child(odd) {
        background-color: orange;
    }
</style>