<template>
    <div class="goodAttr">
        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为最后一级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="marv-15">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectedCateKeys" :options="cateList" @change="catChange"
                        :show-all-levels="false" clearable
                        :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children'}"
                    ></el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="动态参数" name="dynamic">
                    <el-button :disabled="isBtnDisabled" @click="clickAdd" type="primary" size="mini">添加参数</el-button>
                    <el-table :data="dynamicTableData" border stripe class="mart-15">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.vals" :key="i" closable
                                    @close="clickDelAttrVal(i, scope.row)"  size="medium"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 文本输入框 -->
                                <el-input
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    @keyup.enter.native="inputConfirm(scope.row)"
                                    @blur="inputConfirm(scope.row)"
                                    ref="saveTagInput" class="input-new-tag marl-10" size="mini"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button
                                    v-else @click="showInput(scope.row)" size="mini"
                                    class="marl-10"
                                >
                                    +添加新选项
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="name"></el-table-column>
                        <el-table-column label="操作" width="184">
                            <template slot-scope="scope">
                                <el-button @click="clickEdit(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">
                                    编辑
                                </el-button>
                                <el-button @click="clickDelAttr(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="static">
                    <el-button :disabled="isBtnDisabled" @click="clickAdd" type="primary" size="mini">添加参数</el-button>
                    <el-table :data="staticTableData" border stripe class="mart-15">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag
                                    v-for="(item, i) in scope.row.vals" :key="i" closable
                                    @close="clickDelAttrVal(i, scope.row)"  size="medium"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 文本输入框 -->
                                <el-input
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    @keyup.enter.native="inputConfirm(scope.row)"
                                    @blur="inputConfirm(scope.row)"
                                    ref="saveTagInput" class="input-new-tag marl-10" size="mini"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button
                                    v-if="!scope.row.vals.length&&!scope.row.inputVisible"
                                    @click="showInput(scope.row)" size="mini"
                                    class="marl-10"
                                >
                                    +添加默认值
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="name"></el-table-column>
                        <el-table-column label="操作" width="184">
                            <template slot-scope="scope">
                                <el-button @click="clickEdit(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">
                                    编辑
                                </el-button>
                                <el-button @click="clickDelAttr(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <div v-if="showDetail">
            <el-dialog :title="modelTitle" :visible.sync="showDetail" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
                <GoodAttrDetail ref="goodAttrDetail" @close="clickCloseDetail"></GoodAttrDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/GoodAttr.js"></script>
<style scoped src="./css/GoodAttr.css"></style>