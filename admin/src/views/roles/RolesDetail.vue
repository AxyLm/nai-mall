<template>
    <div class="rolesDetail">
        <input type="text" style="position:absolute;top:-9999px">
        <input type="password" style="position:absolute;top:-9999px">
        <el-form ref="rolesDetailForm" :model="thisData" :rules="rules" label-width="80px" >
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="thisData.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="desc">
                <el-input v-model="thisData.desc"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="permissionDesc">
                <el-input v-model="thisData.permissionDesc" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/RolesDetail.js"></script>