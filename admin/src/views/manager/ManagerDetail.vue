<template>
    <div class="managerDetail">
        <input type="text" style="position:absolute;top:-9999px">
        <input type="password" style="position:absolute;top:-9999px">
        <el-form ref="managerDetailForm" :model="thisData" :rules="rules" label-width="80px" >
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="thisData.name" :disabled="!!thisID"></el-input>
            </el-form-item>
            <el-form-item label="密　　码" prop="password">
                <el-input v-model="thisData.password" type="password" :disabled="!!thisID"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="thisData.email"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="mobile">
                <el-input v-model="thisData.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/ManagerDetail.js"></script>