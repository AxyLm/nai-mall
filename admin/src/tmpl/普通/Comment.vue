<template>
    <div class="comment">
        <data-table ref="table"
            searchTips="ID编号，订单编号"
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="true" @checkboxChange = "checkboxChange"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-table-column type="" prop="id" label="编号" width="80" sortable></el-table-column>
            <el-table-column prop="order_id" label="订单ID"></el-table-column>
            <el-table-column prop="order_code" label="订单编号" width="120"></el-table-column>
            <el-table-column prop="user_id" label="用户id"></el-table-column>
            <el-table-column prop="user_name" label="用户名称"></el-table-column>
            <el-table-column prop="content" label="评价内容"  width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="overall_rating" label="综合评分"></el-table-column>
            <el-table-column prop="good_rating" label="商品描述评分" width="120"></el-table-column>
            <el-table-column prop="delivery_rating" label="物流评分"></el-table-column>
            <el-table-column prop="service_rating" label="服务评分"></el-table-column>
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
                <CommentDetail ref="commentDetail" @close="clickCloseDetail"></CommentDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/Comment.js"></script>