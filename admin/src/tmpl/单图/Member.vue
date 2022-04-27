<template>
    <div class="member">
        <data-table ref="table"
            searchTips="ID编号，手机号码"
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="true" @checkboxChange = "checkboxChange"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-table-column type="" prop="id" label="编号" width="80" sortable></el-table-column>
            <el-table-column prop="avatar" label="头像" width="100">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="telephone" label="手机号码"></el-table-column>
            <el-table-column prop="nick_name" label="昵称"></el-table-column>
            <el-table-column prop="real_name" label="真实姓名"></el-table-column>
            <el-table-column prop="email" label="电子邮箱" width="150" show-overflow-tooltip></el-table-column>
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
            <el-table-column label="状态" column-key="deleted" :filters="filters.isDelete" filter-placement="bottom-end" :filter-multiple="false" width="80">
                <template slot-scope="scope">
                    <el-switch :disabled="!rights.set_deleted" v-model="scope.row.deleted" @change="clickDeletedSwitch(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="151" align="center">
                <template slot-scope="scope">
                    <el-button-group >
                        <el-button @click="clickEdit(scope.row)" icon="el-icon-edit" size="mini"></el-button>
                        <el-button @click="clickDel(scope.row)" icon="el-icon-delete" size="mini"></el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </data-table>
        <div v-if="showDetail">
            <el-dialog :title="modelTitle" :visible.sync="showDetail" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
                <MemberDetail ref="memberDetail" @close="clickCloseDetail"></MemberDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/Member.js"></script>