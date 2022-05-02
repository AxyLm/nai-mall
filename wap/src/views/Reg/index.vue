<template>
    <div class="reg">
        <div class="head">
            <van-image width="100" height="100" round :src="require('../../assets/imgs/tp.jpeg')"></van-image>
        </div>
        <van-form @submit="onSubmit" :show-error-message="false">
            <input type="text" value="" style="position:absolute;top:-9999px;">
            <input type="password" value="" style="position:absolute;top:-9999px;">
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
            <van-field
                v-model="comfirmPass"
                type="password"
                placeholder="确认密码"
                left-icon="lock"
                :rules="[{ required: true,validator:checkPwd, message: '请再次输入密码' }]"
            />
            <van-field
                v-model="nick_name"
                left-icon="manager"
                placeholder="请输入昵称"
                :rules="[{ required: true, message: '请输入昵称' }]"
            />
            <van-field
                v-model="email"
                left-icon="invitation"
                placeholder="请输入电子邮箱"
                :rules="[{ required: true,validator:$valid.checkEail, message: '请输入电子邮箱' }]"
            />
            <div style="margin:16px 16px 0;">
                <van-button block type="info" native-type="submit">注册</van-button>
            </div>
            <van-divider 
                 :style="{ borderColor: '#ddd', padding: '0 16px' }" 
                 @click="onLoginClick"
            >
                已有账号，去登陆
            </van-divider>
        </van-form>
    </div>
</template>
<script>
export default {
    name:"Reg",
    data() {
        return {
            username: '',
            password: '',
            comfirmPass: '',
            nick_name: '',
            email: '',
        };
    },
    methods: {
        checkPwd(val){
            if(val == this.password){
                return true
            }else{
                this.$toast.fail("两次密码不一致!")
                return false;
            }
        },
        onLoginClick(){
            this.$router.push("/login");
        },
        onSubmit(values) {
            console.log(this.username)
            console.log(this.password)
        }
    },
}
</script>
<style lang="less" scoped>
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
    .van-form{
        margin: -100px 30px 0;
        background-color: #fff;
        padding: 50px 0 30px;
        border-radius: 20px;
        box-shadow: 0 0 8px 8px rgba(0,0,0,0.01);
    }
    .van-form .van-cell /deep/ .van-icon{
        color: #aaa;
    }
</style>