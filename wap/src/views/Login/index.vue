<template>
<div class="login">
    <div class="head">
        <van-image width="100" height="100" round :src="require('../../assets/imgs/tp.jpeg')"></van-image>
    </div>
    <van-form @submit="onSubmit" :show-error-message="false">
        <input type="text" value="" style="position:absolute;top:-9999px;">
        <input type="password" value="" style="position:absolute;top:-9999px;">
        <!-- label:表单输入框前面的文本 -->
        <!-- placeholder: 默认提示信息 -->
        <!-- rules:定义表单项的验证规则 -->
        <!-- required：是否必传 -->
        <!-- message:错误提示信息 -->
        <van-field
           v-model="username"
           left-icon="phone"
           placeholder="请输入手机号"
           :rules="[{ required: true,validator:$valid.checkTel, message: '请填写手机号' }]"
        />
        <van-field
           v-model="password"
           type="password"
           placeholder="密码"
           left-icon="lock"
           :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-checkbox v-model="checked">记住密码</van-checkbox>
        <!-- round:圆角 -->
        <!-- block：宽度100%显示 -->
        <!-- type：规定按钮的颜色 -->
        <div style="margin:0 16px;">
            <van-button block type="info" native-type="submit">登陆</van-button>
    	</div>
        <van-divider 
             :style="{ borderColor: '#ddd', padding: '0 16px' }" 
             @click="onRegClick"
        >
            没有账号，去注册
        </van-divider>
    </van-form>
    </div>
</template>
<script>
    export default {
        name:"Login",
        data() {
            return {
                username: '',
                password: '',
                checked:true
            };
        },
        created(){
            this.username = this.count.username
            this.password = this.count.password
            this.checked = this.count.remember
        },
        methods: {
            onRegClick(){
                this.$router.push("/reg");
            },
            onSubmit(values) {
                // console.log(this.$utils)
                // console.log(this.username)
                // console.log(this.password)
                // console.log(11)
                this.$store.dispatch("Login",{
                    username:this.username,
                    password:this.password
                }).then(res=>{
                    this.$store.commit("handleAccout",{
                        remember:this.checked,
                        username:this.username,
                        password:this.password
                    })
                    this.$toast.success({
                        duration:600,
                        message:"登录成功"
                    });
                    setTimeout(()=>{
                        this.$router.push('/')
                    },600)
                })
            },
        },
        computed:{
            count(){return this.$store.state.count},
        }
    }
</script>
<style lang="less" scoped>
    // 启用less ,scoped 让选择器只在当前组件生效
    .head{
        height: 460px;
        padding-bottom: 100px;
        background-color: @blue-light;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .van-image{
        border: 4px solid #fff;
    }
    // 样式穿透：>>> 报错，要使用/deep/
    .van-cell /deep/ .van-icon{
        color: #aaa;
    }
    .van-form{
        margin: -100px 30px 0;
        background-color: #fff;
        padding: 50px 0 30px;
        border-radius: 20px;
        box-shadow: 0 0 8px 8px rgba(0,0,0,0.01);
    }
    .van-checkbox{
        padding:30px 32px 20px;
        font-size: 28px;
    }
</style>

  .head{
    height: 460px;
    padding-bottom: 100px;
    background: @blue-light;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .van-image{
        border: 4px solid #fff;
  }
  .van-cell /deep/ .van-icon{
      color: #aaa;
  }
  .van-form{
        margin: -100px 30px 0;
        background-color: #fff;
        padding: 50px 0 30px;
        border-radius: 20px;
        box-shadow: 0 0 8px 8px rgba(0,0,0,0.01);
    }
    .van-checkbox{
        padding:30px 32px 20px;
        font-size: 28px;
    }
</style>