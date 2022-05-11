<template>
  <div>
    <layout title="首页">
      <div class="home-search">
        <van-icon name="search" />
        <p>输入您要搜索的宝贝..</p>
        <img src="@/assets/imgs/home-msg.png" alt="" />
      </div>
      <van-swipe class="home-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in bannerList" :key="'banner' + item.id"
          ><img :src="item.img_url" alt=""
        /></van-swipe-item>
      </van-swipe>
      <van-grid class="home-cat" :border="false" :column-num="4">
        <van-grid-item>
          <img src="@/assets/imgs/home-cat1.png" />
          <p>菲茨</p>
        </van-grid-item>
        <van-grid-item>
          <img src="@/assets/imgs/home-cat2.png" />
          <p>克奈圃</p>
        </van-grid-item>
        <van-grid-item>
          <img src="@/assets/imgs/home-cat3.png" />
          <p>服装</p>
        </van-grid-item>
        <van-grid-item>
          <img src="@/assets/imgs/home-cat4.png" />
          <p>其他</p>
        </van-grid-item>
      </van-grid>
      <div class="home-recommend">
        <h2><span>精选推荐</span></h2>
        <van-list v-model="loading" @load="getGoodList" :finished="finished" finished-text="没有更多" :error.sync="error" error-text = "请求失败请重新加载">
          <van-grid :border="true" :center="false" :column-num="2">
            <van-grid-item v-for="item in goodList" :key="'goodS'+item.id">
              <van-image
                :src="
                  item.pics && item.pics.length
                    ? item.pics[0]
                    : require('@/assets/imgs/banner2.jpg')
                "
              ></van-image>
              <h3>{{ item.name }}</h3>
              <p v-if="item.is_promote">
                <span class="price1">￥{{ item.promote_price }}</span>
                <span class="price2">￥{{ item.price }}</span>
              </p>
              <p v-else>
                <span class="price1">￥{{ item.price }}</span>
              </p>
              <img
                v-if="item.is_promote"
                class="promotion"
                src="@/assets/imgs/home-promotion.png"
              />
            </van-grid-item>
          </van-grid>
        </van-list>
      </div>
    </layout>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      bannerList: [],
      goodList: [],
      queryInfo: {
        pagesize: 6,
        pagenum: 1,
        totalCount: 0,
      },
      finished: false,
      loading: false,
      error: false,
    };
  },
  created() {
    this.getBanner();
  },
  methods: {
    getBanner() {
      let api = this.$http.api.banner.getBanner();
      this.$http.callapi(api).then((res) => {
        this.bannerList = res.data;
      });
    },
    getGoodList() {
      let pagenum = this.queryInfo.pagenum;
      let pagesize = this.queryInfo.pagesize;
      let api = this.$http.api.good.getPage(pagenum, pagesize, { is_recomend: true });
      this.$http.callapi(api).then(res => {
          this.goodList.push(...res.data.good);
          if (this.goodList.length >= res.data.total) {
            this.finished = true;
          } else {
            this.queryInfo.pagenum++;
          }
          this.loading = false;
        }).catch((err) => {
          this.loading = false;
          this.error = true;
        });
    },
  },
};
</script>

<style lang="less" scoped>
/* 搜索区域  */
.home-search {
  background-color: #fff;
  display: flex;
  height: 88px;
  line-height: 88px;
  font-size: 28px;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}
.home-search i {
  color: @gray-6;
  font-size: 40px;
  width: 40px;
}
.home-search p {
  color: @gray-5;
  flex: 1;
  margin: 0 34px 0 10px;
  border-right: 1px solid @border-color;
}
.home-search img {
  width: 46px;
}
/* 轮播图样式 */
.home-swipe .van-swipe-item {
  height: 400px;
  background-color: #39a9ed;
}
.home-swipe .van-swipe-item img {
  width: 100%;
}
/* 分类导航 */
.home-cat {
  margin-bottom: 18px;
}
.home-cat img {
  height: 58px;
  margin-bottom: 8px;
}
.home-cat p {
  font-size: 24px;
  color: @text-color;
}
.home-recommend {
  background-color: #fff;
}
.home-recommend h2 {
  font-size: 28px;
  padding: 30px 0;
  color: @text-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: normal;
}
.home-recommend h2::before,
.home-recommend h2::after {
  display: block;
  content: "";
  height: 1px;
  width: 95px;
  background-color: @border-color;
}
.home-recommend h2::before {
  margin-right: 24px;
}
.home-recommend h2::after {
  margin-left: 24px;
}
.home-recommend h2 span {
  position: relative;
}
.home-recommend h2 span::before,
.home-recommend h2 span::after {
  display: block;
  content: "";
  height: 6px;
  width: 6px;
  border-radius: 10px;
  background-color: @border-color;
  position: absolute;
  top: 50%;
  margin-top: -3px;
}
.home-recommend h2 span::before {
  left: -24px;
}
.home-recommend h2 span::after {
  right: -24px;
}
// 商品列表
.home-recommend .van-grid /deep/ .van-grid-item__content {
  padding: 0;
}
.home-recommend .van-grid .van-image {
  width: 100%;
  height: 300px;
}
.home-recommend .van-grid h3 {
  font-size: 26px;
  font-weight: normal;
  color: @text-color;
  margin-top: 18px;
  padding: 0 20px;
  width: 375px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.home-recommend .van-grid p {
  padding: 0 20px;
  line-height: 20px;
  margin: 15px 0 20px;
}
.home-recommend .van-grid .price1 {
  font-size: 36px;
  color: @black;
  margin-right: 12px;
}
.home-recommend .van-grid .price2 {
  font-size: 20px;
  color: @gray-5;
  text-decoration: line-through;
}
.home-recommend .van-grid .promotion {
  position: absolute;
  width: 65px;
  top: 1px;
  right: 1px;
}
</style>