import DataTable from "cmps/table/DataTable";
import GoodCatDetail from "../GoodCatDetail.vue";
export default {
    name: "GoodCat",
    data() {
        return {
            tableData: [],
            queryInfo:{
                pagesize:10,
                pagenum:1,
                totalCount:0,
            },
            filterData:{ 
                order:"id",
            },
            filters: {
                isDelete: this.$enums.Delete_Status.ToArray(),
            },
            checkedList: [],
            showDetail: false,
        };
    },
    created(){
        this.init();
    },
    methods:{
        // 初始化下拉列表数据
        init(){
            this.getPage();
        },
        // 列表数据查询和筛选
        getPage(){
            let pagenum = this.queryInfo.pagenum;
            let pagesize = this.queryInfo.pagesize;
            let api = this.$http.api.category.getTreeOrList();
            this.$http.callApi(api,{
                params:{pagenum, pagesize},
                data:this.filterData
            }).then(res=>{
                this.tableData = res.data.categories;
                this.queryInfo.totalCount = res.data.total;
            }).catch(err=>{
                console.log(err);
            });
        },
        pageChange(val){ 
            this.queryInfo.pagenum = val;
            this.getPage();
        },
        sizeChange(val){ 
            this.queryInfo.pagesize = val;
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        searchChange(val){ 
            this.filterData.name = val;
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        sortChange(column) {
            if (column.order == null) {
                return;
            }
            if (column.order == "descending") {
                this.filterData.order =column.prop;
            } else if (column.order == "ascending") {
                this.filterData.order =  "-"+column.prop;
            }
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        filterChange(filters) {
            let key = Object.keys(filters)[0];
            let value = filters[key].length > 0 ? filters[key] : null;
            if(value){
                this.$set(this.filterData, key, value);
            }else{
                delete this.filterData[key];
            }
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        checkboxChange(val){
            this.checkedList = val.map(it=>it.id);
        },
        // 增加和修改操作
        clickAdd(){ 
            this.modelTitle = "分类 - 新建";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodCatDetail.init();
            });
        },
        clickEdit(row){ 
            this.modelTitle = "分类 - 修改";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodCatDetail.init(row.id);
            });
        },
        clickCloseDetail(flag) {
            this.showDetail = false;
            if (flag) {
                this.getPage();
            }
        },
        // 删除操作
        clickDel(row){
            this.$confirm("确定删除吗？").then(_=>{
                let api = this.$http.api.category.delete(row.id);
                this.$http.callApi(api).then(res=>{
                    this.$message.success('删除成功！');
                    this.getPage();
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(_=>{
                console.log("不删除");
            });
        },
        clickDelMany(){
            if(!this.checkedList.length){
                return this.$message.error("请选择要删除的项目！");
            }
            let api = this.$http.api.category.batchDelete();
            this.$http.callApi(api,{
                data:{
                    ids:this.checkedList
                }
            }).then(res=>{
                this.$message.success('删除成功！');
                this.getPage();
            }).catch(err=>{
                console.log(err);
            });
        },
        // 其他修改操作
        clickDeletedSwitch(row){
            let api = this.$http.api.category.updateDeleted(row.id);
            this.$http.callApi(api,{
                data:{
                    deleted:row.deleted
                }
            }).then(res=>{
                this.$message.success('设置状态成功！');
                this.getPage();
            }).catch(err=>{
                row.deleted = true;
            });
        },
    },
    computed:{
        rights(){
            return this.$store.state.rights.goods.cat;
        }
    },
    components:{
        DataTable,GoodCatDetail
    }
};