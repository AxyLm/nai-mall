<template>
  <div id="app">
    <div class="header"></div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <ul>
        <router-link tag="li" to="/">home</router-link>
        <router-link tag="li" to="/cart">cart</router-link>
        <router-link tag="li" to="/category">category</router-link>
        <router-link tag="li" to="/my">my</router-link>
      </ul>
    </div>
  </div>
</template>

<style lang="less">

</style>
