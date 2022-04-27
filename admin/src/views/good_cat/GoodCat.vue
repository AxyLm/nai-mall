<template>
    <div class="goodCat">
        <data-table ref="table"
            searchTips="分类名称"
            :data="tableData" @addClick="clickAdd" @delClick="clickDelMany"
            @sortChange="sortChange" @filterChange="filterChange" @searchChange="searchChange"
            :check-column="true" @checkboxChange = "checkboxChange"
            :query-info="queryInfo" @pageChange="pageChange" @sizeChange="sizeChange"
        >
            <el-table-column type="" prop="id" label="编号" width="80" sortable></el-table-column>
            <el-table-column prop="name" label="分类名"></el-table-column>
            <el-table-column prop="email" label="级别" width="80">
                <template slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.level == 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.level == 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
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
                <GoodCatDetail ref="goodCatDetail" @close="clickCloseDetail"></GoodCatDetail>
            </el-dialog>
        </div>
    </div>
</template>
<script src="./js/GoodCat.js"></script>