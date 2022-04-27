<template>
    <div class="commentDetail">
        <el-form ref="commentDetailForm" :model="thisData" :rules="rules" label-width="120px" >
            <el-form-item label="订单id：" prop="order_id">
                <el-input v-model="thisData.order_id"></el-input>
            </el-form-item>
            <el-form-item label="订单编号：" prop="order_code">
                <el-input v-model="thisData.order_code"></el-input>
            </el-form-item>
            <el-form-item label="用户id：" prop="user_id">
                <el-input v-model="thisData.user_id"></el-input>
            </el-form-item>
            <el-form-item label="用户名称：" prop="user_name">
                <el-input v-model="thisData.user_name"></el-input>
            </el-form-item>
            <el-form-item label="评价内容：" prop="content">
                <el-input v-model="thisData.content"></el-input>
            </el-form-item>
            <el-form-item label="综合评分：" prop="overall_rating">
                <el-input v-model="thisData.overall_rating"></el-input>
            </el-form-item>
            <el-form-item label="商品描述评分：" prop="good_rating">
                <el-input v-model="thisData.good_rating"></el-input>
            </el-form-item>
            <el-form-item label="物流评分：" prop="delivery_rating">
                <el-input v-model="thisData.delivery_rating"></el-input>
            </el-form-item>
            <el-form-item label="服务评分：" prop="service_rating">
                <el-input v-model="thisData.service_rating"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/CommentDetail.js"></script>