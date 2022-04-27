<template>
    <div class="managers">
        <data-table ref="table"
            searchTips="编号，用户名"
            :add-btn="!!rights.add" :del-btn="!!rights.del" :check-column="!!rights.del" 
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            @checkboxChange="checkboxChange"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-table-column prop="id" label="编号" width="70" sortable fixed="left"></el-table-column>
            <el-table-column prop="name" label="用户名" width="100" fixed="left"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="100"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态" column-key="deleted" :filters="filters.isDelete" filter-placement="bottom-end" :filter-multiple="false">
                <template slot-scope="scope">
                    <el-switch :disabled="!rights.set_deleted" v-model="scope.row.deleted" @change="clickDeletedSwitch(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="add_time" label="创建时间" width="120">
                <template slot="header" slot-scope="scope">
                    <el-popover placement="bottom-end" width="400" trigger="click" ref="createDateRangePop">
                        <el-date-picker v-model="createDateRange" class="w-100" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        <p class="mart-10 textr">
                            <el-link class="marr-10" :disabled="createDateRange.length!=2" @click="timeFilterChange('create',scope.row)">筛选</el-link>
                            <el-link @click="timeFilterReset('create',scope.row)">重置</el-link>
                        </p>
                        <span slot="reference">创建日期<i class="el-icon-arrow-down el-icon--right fw-b pointer"></i></span>
                    </el-popover>
				</template>
                <template slot-scope="scope">
                    {{scope.row.add_time | ymd}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="151" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button-group >
                        <el-button :disabled="!rights.update" @click="clickEdit(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                        <el-button :disabled="!rights.set_role" @click="clickSetRole(scope.row)" icon="el-icon-setting" size="mini"></el-button>
                        <el-button :disabled="!rights.del" @click="clickDel(scope.row)" icon="el-icon-delete" size="mini"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </data-table>
        <div v-if="showDetail">
            <el-dialog :title="modelTitle" :visible.sync="showDetail" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
                <ManagerDetail ref="managerDetail" @close="clickCloseDetail"></ManagerDetail>
            </el-dialog>
        </div>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="showRole" width="50%" @close="clickCloseRole">
            <div>
                <p>当前用户：{{ currentRow.name }}</p>
                <p>当前角色：{{ currentRow.role_name }}</p>
                <p>
                    分配角色：
                    <el-select v-model="roleID" placeholder="请选择">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showRole = false">取消</el-button>
                <el-button type="primary" @click="clickSaveRole">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script src="./js/Manager.js"></script>