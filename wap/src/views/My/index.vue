<template>
  <div>
    <layout title="我的" :header="false">
        <div class="my-top">
            <van-image round v-if="!isLogin">
                <template v-slot:loading>
                    <van-icon name="manager" />
                </template>
            </van-image>
            <van-image round v-else :src="me.avatar"></van-image>
            <p v-if="!isLogin">
                <router-link to="/login?back=my" tag="span">登录</router-link>
                <span> / </span>
                <router-link to="/reg" tag="span">注册</router-link>
            </p>
            <p v-else>{{me ? me.nick_name : "--"}}</p>
        </div>
        <div class="my-order fixed-border-b1">
            <van-cell title="全部订单" is-link to="/Order">
                <template #icon>
                    <img src="../../assets/imgs/my-order.svg" alt="">
                </template>
            </van-cell>
            <van-row>
                <van-col span="8">
                    <img src="../../assets/imgs/my-wait-pay.svg" alt="">
                    <p>待付款</p>
                    
                </van-col>
                <van-col span="8">
                    <img src="../../assets/imgs/my-wait-delivery.svg" alt="">
                    <p>待发货</p>
                </van-col>
                <van-col span="8">
                    <img src="../../assets/imgs/my-wait-comment.svg" alt="">
                    <p>待评价</p>
                </van-col>
            </van-row>
        </div>
        <div class="my-other fixed-border-b1 fixed-border-t1">
            <van-cell title="我的消息" is-link to="/Message">
                <template #icon>
                    <img src="../../assets/imgs/my-msg.svg" alt="">
                </template>
            </van-cell>
            <van-cell title="我的收藏" is-link to="/Collection">
                <template #icon>
                    <img src="../../assets/imgs/my-collection.svg" alt="">
                </template>
            </van-cell>
            <van-cell title="我的地址" is-link :value="isLogin ?'广州市天河区车陂黄洲工业园' : ''" to="/Address">
                <template #icon>
                    <img src="../../assets/imgs/my-address.svg" alt="">
                </template>
            </van-cell>
            <van-cell title="我的优惠" is-link value="微信支付" to="/Discount">
                <template #icon>
                    <img src="../../assets/imgs/my-discount.svg" alt="">
                </template>
            </van-cell>
        </div>
        <div class="my-scan fixed-border-b1 fixed-border-t1">
            <van-cell title="门店扫码" is-link value="扫码提货" to="/Scan">
                <template #icon>
                    <img src="../../assets/imgs/my-scan.png" alt="">
                </template>
            </van-cell>
        </div>
        <div class="my-btn" v-if="isLogin">
            <van-button type="danger" @click="onLogout" round block>退出登录</van-button>
        </div>
    </layout>
    
  </div>
</template>

<script>
import Vue from 'vue'
export default {
    name:"my",
    created(){
         this.$store.dispatch("GetMe")
    },
    methods:{
      onLoginCllick(){
        this.$router.push('/login')
      },
      onLogout(){
        this.$dialog.confirm({
        title: '退出登录',
        message: '您确定要退出登录吗？',
        }).then(() => {
            this.$store.commit("handleLogout");
        }).catch(() => {});
      }
    },
    computed:{
        isLogin(){
            let tokenBox = this.$store.state.token;
            return !!(tokenBox && tokenBox.access_token);
        },
        me(){
            return this.$store.state.me;
        }
    }
}
</script>

<style lang="less" scoped>
// 顶部 
    .my-top{
        height: 410px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: @blue-dark;
    }
    .my-top .van-image{
        width: 172px;
        height: 172px;
    }
    .my-top .van-icon{
        font-size: 120px;
        color: @gray-5;
    }
    .my-top p{
        font-size: 32px;
        margin-top: 32px;
        color: #fff;
    }
    // 我的订单
    .my-order {
        background: #fff;
    }
    .my-order .van-cell::after{
        left: 0;
        right: 0;
    }
    .my-order .van-cell img{
        display: block;
        width: 36px;
        margin-right: 25px;
    }
    .my-order .van-row{
        padding: 10px 0 28px;
    }
    .my-order .van-col{
        text-align: center;
    }
    .my-order .van-col img{
        height: 38px;
    }
    .my-order .van-col p{
        font-size: 26px;
        margin-top: 16px;
    }
    // 其他列表
    .my-other {
        margin: 18px 0;
    }
    .my-other .van-cell img{
        width: 38px;
        margin-right: 25px;
    }
    .my-other .van-cell .van-cell__value{
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    // 门店扫码
    .my-scan {
        margin-bottom: 18px;
    }
    .my-scan .van-cell{
        align-items: center;
    }
    .my-scan .van-cell img{
        width: 38px;
        height: 29px;
        margin-right: 25px;
    }
    // 退出按钮
    .my-btn {
        margin: 32px;
    }
</style>