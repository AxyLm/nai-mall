<template>
    <div class="roles">
        <data-table ref="table"
            searchTips="角色名" :footer="false" height="calc(100vh - 228px)"
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="true" @checkboxChange = "checkboxChange"
        >
           
            <el-table-column prop="id" label="编号" width="70" sortable></el-table-column>
            <el-table-column prop="name" label="角色名" width="180"></el-table-column>
            <el-table-column prop="desc" label="角色描述"></el-table-column>
            <el-table-column type="expand" label="权限列表" width="70">
                <template slot-scope="scope">
                    <!-- 行 -->
                        <el-row
                            :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item, index) in scope.row.child"
                            :key="item.id"
                        >
                            <!-- 列   渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="clickDelRight(scope.row, item.id)">
                                    {{ item.name }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row
                                    :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, index2) in item.children"
                                    :key="item2.id"
                                >
                                    <el-col :span="6">
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="clickDelRight(scope.row, item2.id)"
                                        >
                                            {{ item2.name }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                            closable
                                            type="warning"
                                            v-for="item3 in item2.children"
                                            :key="item3.id"
                                            @close="clickDelRight(scope.row, item3.id)"
                                        >
                                            {{ item3.name }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="151" align="center">
                <template slot-scope="scope">
                    <el-button-group >
                        <el-button @click="clickEdit(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                        <el-button @click="clickOpenRights(scope.row)" icon="el-icon-setting" size="mini"></el-button>
                        <el-button @click="clickDel(scope.row)" icon="el-icon-delete" size="mini"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </data-table>
        <!-- 添加和修改弹窗 -->
        <div v-if="showDetail">
            <el-dialog :title="modelTitle" :visible.sync="showDetail" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
                <RolesDetail ref="rolesDetail" @close="clickCloseDetail"></RolesDetail>
            </el-dialog>
        </div>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="showRights" width="50%">
            <!-- 树形控件 -->
            <el-tree
                :data="rightsList"
                :props="{children: 'children',label: 'name'}"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="defRightKeys"
                ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showRights = false">取 消</el-button>
                <el-button @click="clickSaveRights" type="primary">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./js/Roles.js"></script>
<style scoped src="./css/Roles.css"></style>