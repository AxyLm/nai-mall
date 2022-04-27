<template>
    <div>
        <template v-for="item in list">
            <template v-if="!!item.children && item.children.length > 0">
                <el-submenu :index="String(item.id)" :key="item.id">
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="item.icon"></i>
                        <!-- 文本 -->
                        <span>{{ item.name }}</span>
                    </template>
                    <menu-item :list="item.children" />
                </el-submenu>
            </template>
            <template v-if="!item.children || item.children.length == 0">
                <el-menu-item :index="'/'+item.path" :key="item.id" :disabled="item.disabled">
                    <!-- 文本 -->
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </template>
    </div>
</template>
<script src="./js/LayoutMenuItem.js"></script>
<style scoped src="./css/LayoutMenuItem.css"></style>
