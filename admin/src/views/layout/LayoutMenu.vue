<template>
<div id="nav-menu">
    <div class="login-info" v-if="$store.state.me">
        <a href="javascript:void(0);">
            <img :src="$store.state.me.avatar" class="online">
            <span>{{$store.state.me.name}}({{$store.state.me.email}}) </span>
        </a>
    </div>
    <el-menu 
        :default-active="defaultPath"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="#3a3633"
        :collapse = "$store.state.menuFolded"
        :collapse-transition="false"
        :router="true"
        :unique-opened="true"
    >
        <menu-item :list="this.$store.state.menus" />
    </el-menu>
</div>
</template>
<script src="./js/LayoutMenu.js"></script>
<style scoped src="./css/LayoutMenu.css"></style>