<template>
    <div class="memberDetail">
        <el-form ref="memberDetailForm" :model="thisData" :rules="rules" label-width="100px" >
            <el-form-item label="手机号码：" prop="telephone">
                <el-input v-model="thisData.telephone"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="thisData.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="repassword">
                <el-input v-model="thisData.repassword"></el-input>
            </el-form-item>
            <el-form-item label="昵称：" prop="nick_name">
                <el-input v-model="thisData.nick_name"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="real_name">
                <el-input v-model="thisData.real_name"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱：" prop="email">
                <el-input v-model="thisData.email"></el-input>
            </el-form-item>
            <el-form-item label="头像：" prop="avatar">
                <file v-model="thisData.avatar" type="member" :limit="1" :is-img="true"></file>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/MemberDetail.js"></script>