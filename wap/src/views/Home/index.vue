<template>
  <div>
      <van-button type="primary" @click="showPopup">主要按钮</van-button>
      <van-popup v-model="show">内容</van-popup>
  </div>
</template>

<script>
export default {
    name:"home",
    data() {
    return {
      show: false,
    };
  },

  methods: {
    showPopup() {
      this.show = true;
    },
  },
}
</script>

<style>

</style>