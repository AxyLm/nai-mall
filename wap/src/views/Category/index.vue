<template>
  <div>
    <layout title="分类">
      <van-sidebar v-model="active" @change = "onchange">
        <van-sidebar-item v-for="(item,index) in catlist" :key="index" :title="item.name" />
    </van-sidebar>
    
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
           v-model="loading" 
	          :finished="finished" finished-text="没有更多了" 
	          :error.sync="error" error-text="请求失败，点击重新加载"
        >
            <van-card
            v-for="(item,index) in goodlist"
            :key ="index"
            :title="item.name"
            :thumb="item.pics[0]"
          >
            <template #thumb>
              <img :src="item.pics[0]" alt="">
              <img class="cuxiao" v-if="item.is_promote" src="../../assets/imgs/home-promotion.png" alt="">
            </template>
            <template #price>
              <p v-if="item.is_promote">
                <ins>￥{{item.promote_price}}</ins>
                <del>￥{{item.price}}</del>
              </p>
              <p v-else>
                <ins>￥{{item.price}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ins>
              </p>
            </template>
            <template #bottom>
                <van-button icon="plus" hairline plain  type="warning" size="mini">加入购物车</van-button>
              
            </template>
            </van-card>
        </van-list>
      </van-pull-refresh>
    </layout>
      
  </div>
</template>

<script src="./js/index.js" ></script>
<style src="./less/index.less" scoped lang="less"></style>