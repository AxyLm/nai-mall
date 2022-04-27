<template>
    <el-container>
        <!-- 上 -->
        <el-header height="49px" class="top">
            <layout-header></layout-header>
        </el-header>
        <!-- 下 -->
        <el-container style="height:calc(100% - 49px);">
            <!-- 左 -->
            <el-aside width="200px">
                <layout-menu></layout-menu>
            </el-aside>
            <!-- 右 -->
            <el-container>
                <!-- 上 -->
                <el-header height="40px" class="main">
                    <layout-bread-crumb></layout-bread-crumb>
                </el-header>
                <!-- 中 -->
                <el-main>
                    <router-view />
                </el-main>
                <!-- 下 -->
                <el-footer height="52px">©2017-2019 EDA All rights reserved.</el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>
<script src="./js/Layout.js"></script>
<style scoped src="./css/Layout.css"></style>
