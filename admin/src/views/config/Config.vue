<template>
    <div class="config">
        <el-form ref="configForm" :model="thisData" :rules="rules">
            <el-tabs v-model="activeIndex" type="border-card">
                <!-- 基本配置 -->
                <el-tab-pane label="基本配置" name="0">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="客服电话" prop="server_tel">
                                <el-input v-model="thisData.server_tel" maxlength="15"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="售后电话" prop="aftersale_tel">
                                <el-input v-model="thisData.aftersale_tel" maxlength="15"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <!-- 注册条款 -->
                <el-tab-pane label="注册条款" name="1">
                    <editor v-model="thisData.register_info" v-if="activeIndex==1" path="ueditor"></editor>
                </el-tab-pane>
                <!-- 售后说明 -->
                <el-tab-pane label="售后说明" name="2">
                    <editor v-model="thisData.aftersale_info" v-if="activeIndex==2" path="ueditor"></editor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <el-button @click="submitForm" icon="fa fa-save"> 保存 </el-button>
    </div>
</template>
<script src="./js/Config.js"></script>
<style scoped src="./css/Config.css"></style>
