<template>
    <div class="profileDetail">
        <input type="text" style="position:absolute;top:-9999px">
        <input type="password" style="position:absolute;top:-9999px">
        <el-form ref="profileDetailForm" :model="thisData" :rules="rules" label-width="80px" >
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="thisData.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="原密码" prop="pwd">
                <el-input v-model="thisData.pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="thisData.newPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="thisData.email"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="mobile">
                <el-input v-model="thisData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="用户头像" prop="avatar">
                <file v-model="avatarArr" type="manager" :limit="1" :is-img="true"></file>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
        </div>
    </div>
</template>
<script src="./js/Profile.js"></script>