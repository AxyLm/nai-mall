<template>
  <div id="layout">
    <div id="header">
        <div class="left">
  				<i class="fa fa-chevron-left"></i>
  			</div>
  			<h2 class="title">首页</h2>
  			<div class="right">
  				<i class="fa fa-search"></i>
  			</div>
    </div>
    <div id="main">
      <router-view></router-view>
    </div>
    <div id="nav">
      <ul>
        <router-link tag="li" to="/">
          <i class="fa fa-home"></i>
          <p>首页</p>
        </router-link>
        <router-link tag="li" to="/category">
          <i class="fa fa-list"></i>
          <p>分类</p>
        </router-link>
        <router-link tag="li" to="/cart">
          <i class="fa fa-shopping-cart"></i>
          <p>购物车</p>
        </router-link>
        <router-link tag="li" to="/my">
          <i class="fa fa-user-circle"></i>
          <p>我的</p>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name:"Loyout"
}
</script>

<style lang="less">
    #header{
        display: flex;
        height: 100px;
        line-height: 100px;
        width: 750px;
        background-color: #3296fa;
        color: #fff;
        position: fixed;
        top: 0;
        font-size: 32px;
        padding: 0 20px;
    }
    #header h2{
        flex: 1;
        text-align: center;
    }
    #main{
        padding-top: 100px;
        padding-bottom: 90px;
    }
    #nav {
        background-color: #fff;
        width: 750px;
        height: 90px;
        position: fixed;
        bottom: 0;
        font-size: 24px;
    }
    #nav ul{
        display: flex;
        height: 90px;
        justify-content: space-around;
    }
    #nav ul li{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #666;
    }
    #nav ul li i{
        font-size: 40px;
        margin-bottom: 5px;
    }
    /* 
     * router-link-exact-active是vue-router加给当前激活的router-link 
     */
    #nav ul li.router-link-exact-active{
        color: #3296fa;
	  }
</style>
