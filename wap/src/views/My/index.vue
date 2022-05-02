<template>
  <div>
    <layout title="我的" :header="false">
      <van-button  @click="onLoginCllick" type="info">登录</van-button>
    </layout>
    
  </div>
</template>

<script>
export default {
    name:"my",
    methods:{
      onLoginCllick(){
        this.$router.push('/login')
      }
    }
}
</script>

<style>

</style>