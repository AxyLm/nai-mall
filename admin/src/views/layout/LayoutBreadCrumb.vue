<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index">
            {{item.meta.title}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script src="./js/LayoutBreadCrumb.js"></script>
<style scoped src="./css/LayoutBreadCrumb.css"></style>
