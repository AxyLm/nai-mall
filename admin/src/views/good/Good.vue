<template>
    <div class="good">
        <data-table ref="table"
            searchTips="请输入商品名称"
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="true" @checkboxChange = "checkboxChange"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-cascader slot="searchOther" class="fl marr-10"
                v-model="selectedCateKeys" :options="cateList" @change="catChange"
                :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children', checkStrictly:true}"
                clearable placeholder="请选择父级分类"
            ></el-cascader>
            <el-table-column prop="id" label="编号" width="70" sortable></el-table-column>
            <el-table-column prop="name" label="商品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="单价" width="80" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="is_promote" label="促销" column-key="is_promote" :filters="filters.isOrNot" filter-placement="bottom-end" :filter-multiple="false" align="center" width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :class="{
                        'colr-success':scope.row.is_promote,
                        'colr-error':!scope.row.is_promote
                    }">
                        {{scope.row.is_promote?"是":"否"}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="promote_price" label="促销价" width="80" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    {{scope.row.promote_price || "--"}}
                </template>
            </el-table-column>
            <el-table-column prop="number" label="数量" width="80" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="weight" label="重量" width="80" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="创建时间" show-overflow-tooltip width="120">
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
            <el-table-column label="推荐" column-key="is_recomend" :filters="filters.isOrNot" filter-placement="bottom-end" :filter-multiple="false" width="80">
                <template slot-scope="scope">
                    <el-switch :disabled="!rights.set_recomend" v-model="scope.row.is_recomend" @change="clickRecomendSwitch(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="上架" column-key="deleted" :filters="filters.isOrNot" filter-placement="bottom-end" :filter-multiple="false" width="80">
                <template slot-scope="scope">
                    <el-switch :disabled="!rights.set_deleted" v-model="scope.row.deleted" @change="clickDeletedSwitch(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" column-key="state" :filters="filters.isAudit" filter-placement="bottom-end" :filter-multiple="false" width="80">
                <template slot-scope="scope">
                    <span :class="scope.row.state | enumsColor($enums.Audit_Status)">
                        {{Number(scope.row.state) | enums($enums.Audit_Status)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="309" align="center">
                <template slot-scope="scope">
                    <el-button-group >
                        <el-button @click="clickEdit(scope.row)" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!--0未提交 1审核中 2已通过 3被拒绝 -->
                        <el-button @click="clickSubmit(scope.row)" :disabled="[1,2].includes(scope.row.state)" icon="el-icon-document-checked" size="mini">提交</el-button>
                        <el-button @click="clickAudit(scope.row)" :disabled="[0,2,3].includes(scope.row.state)" icon="el-icon-document-checked" size="mini">审核</el-button>
                        <el-button @click="clickDel(scope.row)" icon="el-icon-delete" size="mini">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </data-table>
        <div v-if="showDetail">
            <el-dialog :title="modelTitle" :visible.sync="showDetail" fullscreen :close-on-click-modal="false" :close-on-press-escape="false">
                <GoodDetail ref="goodDetail" @close="clickCloseDetail"></GoodDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/Good.js"></script>