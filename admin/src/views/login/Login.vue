<template>
	<div class="login">
		<el-card>
			<h2>欢迎登录</h2>
			<el-form :model="loginForm" :rules="loginRules" ref="fm">
				<el-form-item prop="username">
					<el-input
					 	placeholder="请输入账号" prefix-icon="el-icon-user" 
						v-model="loginForm.username"
					></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
					 	type="password"
					 	placeholder="请输入密码" prefix-icon="el-icon-lock"
					 	v-model="loginForm.password"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submit">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script src="./js/Login.js"></script>
<style scoped src="./css/Login.css"></style>