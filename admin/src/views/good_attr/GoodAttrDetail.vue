<template>
    <div class="goodAttrDetail">
        <input type="text" style="position:absolute;top:-9999px">
        <input type="password" style="position:absolute;top:-9999px">
        <el-form ref="goodAttrDetailForm" :model="thisData" :rules="rules" label-width="80px" >
            <el-form-item label="参数名称" prop="name">
                <el-input v-model="thisData.name"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/GoodAttrDetail.js"></script>