<template>
    <div class="data-table">
        <div class="table-hd clearfix marb-15" v-if="header">
			<div class="fl search-group">
                <el-button v-if="addBtn" @click="addClick" class="fl marr-10" type="primary" icon="el-icon-plus"></el-button>
                <el-input class="fl marr-10" v-model="searchInput" :placeholder="searchTips"></el-input>
                <slot name="searchOther"></slot>
                <el-button @click="searchChange" class="fl" type="primary" icon="el-icon-search"></el-button>
			</div>
            <div class="fr">
                <slot name="btnOther"></slot>
                <el-button type="danger" icon="el-icon-delete"  @click="delClick" v-if="delBtn"></el-button>
            </div>
        </div>
        <el-table 
            :data="data" v-loading="loading"
            :row-key="rowKey" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :lazy="lazy" :load="load" 
            ref="table" style="width: 100%" :header-cell-style="headerStyle" 
            :height="height" :default-expand-all="false" 
            @row-dblclick="trDblclick" 
            @sort-change="sortChange" @filter-change="filterChange" 
            @select="organizeData" @select-all="organizeData" 
        >
            <el-table-column
                v-if="radioColumn"
                label="选择" width="50" align="center"
            >
                <template slot-scope="scope">
                    <el-radio :label="scope.row" v-model="radio" @change.native="radioChange(scope.row)">{{''}}</el-radio>
                </template>
            </el-table-column>
            <el-table-column 
                v-if="checkColumn" :selectable="selectable"
                type="selection" width="40" align="center"
            >
            </el-table-column>
            <slot></slot>
        </el-table>
        <div class="table-ft" v-if="footer">
            <el-pagination 
                layout="total, prev, pager, next, jumper, sizes"
                :total="queryInfo.totalCount" :current-page.sync="queryInfo.pagenum" 
                :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize" 
                @size-change="sizeChange" @current-change="pageChange" 
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: "DataTable",
    data() {
        return {
            flag: false,
            radio: {},
            checked: [],
            searchInput:"",
            timer:null
        };
    },
    created: function() {
        let that = this;
    },
    methods: {
        /*
         * 初始化选择状态
         */ 
        init(defaultChecked) {
            let that = this;
            // 多选 defaultChecked为数组包含所有数据集合 
            if (defaultChecked.constructor == Array) {
                this.checked = defaultChecked;
                let datas = this.data;
                let arr = []
                for (var i = 0; i < that.checked.length; i++) {
                    for (var j = 0; j < datas.length; j++) {
                        if (that.checked[i].id == datas[j].id) {
                            arr.push(datas[j]);
                        }
                    }
                }
                that.toggleSelection(arr);
            // 单选 defaultChecked为数字id
            } else {
                for (var i = 0; i < this.data.length; i++) {
                    if (defaultChecked == this.data[i].id) {
                        this.radio = this.data[i];
                        break;
                    }
                }
            }
        },
        /*
         * 单选
         */ 
        radioChange(row) {
            this.$emit("radioChange", row);
        },
        /*
         * 选中每一行
         */ 
        toggleSelection(rows) {
            setTimeout(() => {
                if (rows.length > 0) {
                    this.$nextTick(() => {
                        rows.forEach(row => {
                            this.$refs.table.toggleRowSelection(row, true);
                        });
                    });
                } else {
                    this.$refs.table.clearSelection();
                }
            }, 0);
        },
        /*
         * 点击复选框或全选，组织并向外发射数据
         */  
        organizeData(selection) {
            if (this.checked.length == 0) {
                this.checked = selection;
            }else{
                // 已经存储的表格数据
                let allIds=[];
                this.checked.forEach(element => {
                    allIds.push(element.id)
                });
                // 当前选择的表格数据
                // 和已经存储的表格数据对比，如果没有当前选择的数据，则添加到已经存储的数据中
                let selectedIds = [];
                selection.forEach(element => {
                    selectedIds.push(element.id);
                    if (!allIds.includes(element.id)) {
                        this.checked.push(element);
                    }
                });
                // 没被选择的表格数据
                // 和已经存储的表格数据对比，如果含有没被选择的数据，则从已经存储的数据中删除
                let notSelectedIds = [];
                this.data.forEach(element => {
                    if (!selectedIds.includes(element.id)) {
                        notSelectedIds.push(element.id)
                    }
                });
                notSelectedIds.forEach(id => {
                    let index = this.checked.findIndex(element => element.id == id);
                    index>=0 && this.checked.splice(index,1);
                });
            }
            this.$emit("checkboxChange", this.checked);
        },
        // 禁用
        selectable(row) {
            return !row.isForbidden;
        },
        /*
         * 向外发射事件
         */ 
        trDblclick(row) {
            this.$emit("trDblclick",row);
        },
        addClick(){
            this.$emit("addClick");
        },
        delClick(){
            this.$emit("delClick");
        },
        searchChange(){
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.$emit('searchChange', this.searchInput);
            },600);
        },
        filterChange(val) {
            this.$emit("filterChange", val);
        },
        sortChange(val) {
            this.$emit("sortChange", val);
        },
        sizeChange(val) {
            this.$emit("sizeChange", val);
        },
        pageChange(val) {
            this.$emit("pageChange", val);
        }
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        header: {
            type: Boolean,
            default: true
        },
        footer: {
            type: Boolean,
            default: true
        },
        height: {
            type: String,
            default: "calc(100vh - 273px)"
        },
        loading: {
            type: Boolean,
            default: false
        },
        checkColumn: {
            type: Boolean,
            default: false
        },
        radioColumn: {
            type: Boolean,
            default: false
        },
        queryInfo: {
            type: Object,
            default() {
                return {};
            }
        },
        searchTips:{
            type: String,
            default:"请输入搜索内容"
        },
        rowKey: {
            type: String,
            default: "id"
        },
        lazy: {
            type: Boolean,
            default: false
        },
        load:{
            type:Function,
            default: new Function()
        },
        headerStyle: {
            type: Object,
            default() {
                return {};
            }
        },
        delBtn:{
            type:Boolean,
            default:true
        },
        addBtn:{
            type:Boolean,
            default:true
        }
    }
};
</script>

<style scoped>
    .search-group .el-input{
        width: 300px;
    }
    .table-ft{
        background-color: #fff;
        padding: 6px 15px;
    }
    .table-ft >>> .el-pagination__sizes{ float: right; margin-right: 0; }
    .table-ft >>> .btn-prev,
    .table-ft >>>  .btn-next,
    .table-ft >>> .el-pager,
    .table-ft >>> .el-pagination__jump{ float: left;margin-left: 0; }
    .data-table >>> .el-table-column--selection .cell{ padding-right:10px; }
</style>