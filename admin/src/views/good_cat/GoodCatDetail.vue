<template>
    <div class="goodCatDetail">
        <input type="text" style="position:absolute;top:-9999px">
        <input type="password" style="position:absolute;top:-9999px">
        <el-form ref="goodCatDetailForm" :model="thisData" :rules="rules" label-width="100px" >
            <el-form-item label="分类名称：" prop="name">
                <el-input v-model="thisData.name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：" prop="pid" v-if="!thisID">
                <el-cascader
                    v-model="selectedCates"
                    :options="parentCateList"
                    :props="{
                        expandTrigger: 'hover',
                        value: 'id',
                        label: 'name',
                        children: 'children',
                        checkStrictly: true 
                    }"
                    @change="onCatChange"
                    clearable
                    class="w-100"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/GoodCatDetail.js"></script>