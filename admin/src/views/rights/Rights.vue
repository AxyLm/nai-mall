<template>
    <div class="rights">
        <data-table ref="table" :data="tableData" :header="false" :footer="false" :check-column="false" height="calc(100vh - 181px)">
            <el-table-column type="" prop="id" label="编号" width="70" sortable></el-table-column>
            <el-table-column prop="name" label="权限名称" width="180"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column label="权限等级" width="90">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == '0'" type="danger">一级</el-tag>
                    <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                    <el-tag v-else type="waring">三级</el-tag>
                </template>
            </el-table-column>
        </data-table>
    </div>
</template>
<script src="./js/Rights.js"></script>