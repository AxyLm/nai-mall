<template>
    <div class="goodDetail">
        <el-form ref="goodDetailForm" :model="thisData" :rules="rules">
            <el-tabs v-model="activeIndex" :before-leave="beforeChangeTab" type="border-card">
                <!-- 基本信息 -->
                <el-tab-pane label="基本信息" name="0">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="商品名称" prop="name">
                                <el-input v-model="thisData.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品分类" prop="cat">
                                <el-cascader
                                    v-model="thisData.cat" :options="cateList" @change="catChange" class="w-100"
                                    :show-all-levels="false" clearable
                                    :props="{ expandTrigger: 'hover', label: 'name', value: 'id', children: 'children'}"
                                ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品重量" prop="weight">
                                <el-input v-model="thisData.weight" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品数量" prop="number">
                                <el-input v-model="thisData.number" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品价格" prop="price">
                                <el-input v-model="thisData.price" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否促销" prop="is_promote">
                                <el-select v-model="thisData.is_promote" @change="!thisData.is_promote && (thisData.promote_price=null)" class="w-100">
                                    <el-option :value="false" label="否"></el-option>
                                    <el-option :value="true" label="是"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="促销价格" prop="promote_price">
                                <el-input :disabled="!thisData.is_promote" v-model="thisData.promote_price" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <!-- 商品参数 -->
                <el-tab-pane label="商品参数" name="1" :lazy="false">
                    <el-form-item v-for="item in dynamicTableData" :label="item.name" :key="item.id">
                        <el-checkbox-group v-model="item.value">
                            <el-checkbox v-for="(jtem, index) in item.vals" :label="jtem" :key="index" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <!-- 商品属性 -->
                <el-tab-pane label="商品属性" name="2" :lazy="false">
                    <el-form-item v-for="item in staticTableData" :label="item.name" :key="item.id">
                        <el-input v-model="item.value"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <!-- 商品图片 -->
                <el-tab-pane label="商品图片" name="3" :lazy="false">
                    <file v-model="fileList" :is-img="true" type="goodspics"></file>
                </el-tab-pane>
                 <!-- 商品内容 -->
                <el-tab-pane label="商品内容" name="4">
                    <editor v-model="thisData.introduce" path="ueditor"></editor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <!-- 按钮 -->
        <div class="dialog-fixed-btn textr">
            <progressButton type="primary" v-editButton="thisData" @click="submitForm">提交</progressButton>
            <el-button @click="close">关闭</el-button>
        </div>
    </div>
</template>
<script src="./js/GoodDetail.js"></script>
<style scoped src="./css/GoodDetail.css"></style>
