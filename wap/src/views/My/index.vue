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

<script src="./js/index.js" ></script>
<style src="./less/index.less" scoped lang="less"></style>
