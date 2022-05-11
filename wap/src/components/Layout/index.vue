<template>
  <div id="layout">
    <van-nav-bar 
		      fixed 
          :title="title" 
          left-arrow 
          v-if="header" 
		      @click-left="onClickLeft" 
          @click-right="onClickRight">
      <template slot="right"><slot name="ricon"></slot></template>
    </van-nav-bar>
   
  <van-tabbar route v-model="active" v-if="footer">
		<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
		<van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
		<van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
		<van-tabbar-item to="/my" icon="friends-o">我的</van-tabbar-item>
	</van-tabbar>
    <div class="main">
      <slot></slot>
    </div>
    
  </div>
</template>

<script>
export default {
    name:"Loyout",
    data(){
      return{
        active:0
      }
    },
    methods:{
    onClickLeft() {
      history.go(-1);
		},
		onClickRight() { },
    },
    props:{
      title:{
        type:String,
        required:true,
        default:'标签'
      },
      header:{ 
        type:Boolean, 
        default: true 
      },
      footer:{ 
        type:Boolean, 
        default: true 
      }
    }
}
</script>

<style lang="less">
  .van-tabbar,.van-nav-bar{
		max-width: 750px;
		left: auto !important;
	}
    /* 解决不显示头部时，依然有padding-top的问题 */
  .van-nav-bar ~ .main{
        padding-top: 92px;
	}
  /* 解决不显示底部时，依然有padding-bottom的问题 */
  .van-tabbar ~ .main{
      padding-bottom: 100px;
  }
  .van-tabbar{
    z-index: 2 !important;
  }
</style>
