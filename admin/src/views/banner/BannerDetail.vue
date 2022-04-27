<template>
    <div class="bannerDetail">
        <el-alert title="注意：图片设计时的宽高比例为1:1，推荐800*800，否则可能会出现缩放或变形！" type="warning" :closable="false" show-icon class="marb-20"></el-alert>
        <el-form ref="bannerDetailForm" :model="thisData" :rules="rules" label-width="100px" >
            <el-form-item label="上传图片：" prop="img_url">
                <file v-model="thisData.img_url" type="banner" :limit="1" :is-img="true"></file>
            </el-form-item>
            <el-form-item label="跳转地址：" prop="target">
                <el-input v-model="thisData.target"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
                <el-input v-model="thisData.sort"></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="desc">
                <el-input v-model="thisData.desc"></el-input>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/BannerDetail.js"></script>