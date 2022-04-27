<template>
    <div class="storeDetail">
        <el-form ref="storeDetailForm" :model="thisData" :rules="rules" label-width="92px" >
            <el-form-item label="门店名称：" prop="name">
                <el-input v-model="thisData.name"></el-input>
            </el-form-item>
            <el-form-item label="选择地区：" prop="area_code">
                <Area v-model="thisData.area_code" ref="area" class="w-100"></Area>
            </el-form-item>
            <el-form-item label="街道信息：" prop="street_info">
                <el-input v-model="thisData.street_info"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/StoreDetail.js"></script>