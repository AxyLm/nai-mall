<template>
    <div class="header">
        <div class="logo-group">
            <img src="~assets/images/logo.png" alt="">
        </div>
        <div class="btn-group">
            <!-- 折叠按钮 -->
            <div class="hide-menu">
                <a href="javascript:void(0);" title="折叠菜单" @click="toggleMenu">
                    <i class="fa fa-reorder"></i>
                </a>
            </div>
            <!-- 退出按钮 -->
            <div class="logout">
                <a href="javascript:void(0);" title="退出" @click="logout">
                    <i class="fa fa-sign-out"></i>
                </a>
            </div>
        </div>
    </div>
</template>
<script src="./js/LayoutHeader.js"></script>
<style scoped src="./css/LayoutHeader.css"></style>