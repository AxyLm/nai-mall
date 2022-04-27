<template>
    <div class="payDetail">
        <el-form ref="payDetailForm" :model="thisData" :rules="rules" label-width="92px" >
            <el-form-item label="支付方式：" prop="name">
                <el-input v-model="thisData.name"></el-input>
            </el-form-item>
            <el-form-item label="排序号：" prop="sort">
                <el-input v-model="thisData.sort"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/PayDetail.js"></script>