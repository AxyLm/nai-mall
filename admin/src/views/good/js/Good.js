import DataTable from "cmps/table/DataTable";
import GoodDetail from "../GoodDetail.vue";
export default {
    name: "Good",
    data() {
        return {
            tableData: [],
            checkedList:[],
            queryInfo:{
                pagesize:10,
                pagenum:1,
                totalCount:0,
            },
            filterData:{ 
                order:"-id",
            },
            createDateRange: [],
            filters: {
                isDelete: this.$enums.Delete_Status.ToArray(),
                isOrNot: this.$enums.Is_Status.ToArray(),
                isAudit: this.$enums.Audit_Status.ToArray(),
            },
            showDetail: false,
            // 分类筛选
            selectedCateKeys:[],
            cateList:[]
        };
    },
    created(){
        this.init();
    },
    methods:{
        // 初始化下拉列表数据
        init(){
            this.getPage();
            this.getCateList();
        },
        getCateList() {
            let api = this.$http.api.category.getTreeOrList();
            this.$http.callApi(api,{
                data:{
                    deleted: 1
                }
            }).then(res => {
                this.cateList = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        catChange() {
            let idArrar =  this.selectedCateKeys;
            this.filterData.cat_one_id = null;
            this.filterData.cat_two_id = null;
            this.filterData.cat_three_id = null;
            let catID = idArrar[idArrar.length-1];
            if(idArrar.length==1){
                this.filterData.cat_one_id = catID;
            }else if(idArrar.length==2){
                this.filterData.cat_two_id = catID;
            }else if(idArrar.length==3){
                this.filterData.cat_three_id = catID;
            }
        },
        // 列表数据查询和筛选
        getPage(){
            let pagenum = this.queryInfo.pagenum;
            let pagesize = this.queryInfo.pagesize;
            let api = this.$http.api.good.getPage(pagenum, pagesize);
            this.$http.callApi(api,{
                data:this.filterData
            }).then(res=>{
                this.tableData = res.data.good;
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
        timeFilterChange(type, row) {
			if (type == "create") {
				if (this.createDateRange.length == 2) {
					this.filterData.add_time = this.createDateRange;
				}
				this.$refs.createDateRangePop.doClose();
			}
			if (type == "update") {
				if (this.updateDateRange.length == 2) {
					this.filterData.upd_time = this.updateDateRange;
				}
				this.$refs.updateDateRangePop.doClose();
			}
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
		timeFilterReset(type, row) {
			if (type == "create") {
				this.createDateRange = [];
				this.filterData.add_time = null;
				this.$refs.createDateRangePop.doClose();
			}
			if (type == "update") {
				this.updateDateRange = [];
				this.filterData.upd_time = null;
				this.$refs.updateDateRangePop.doClose();
			}
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
        checkboxChange(val){
            this.checkedList = val.map(it=>it.id);
        },
        // 增加和修改操作
        clickAdd(){ 
            this.modelTitle = "商品 - 新建";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodDetail.init();
            });
        },
        clickEdit(row){ 
            this.modelTitle = "商品 - 修改";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodDetail.init(row.id);
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
                let api = this.$http.api.good.delete(row.id);
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
            let api = this.$http.api.good.batchDelete();
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
        clickRecomendSwitch(row){
            let api = this.$http.api.good.updateRecomend(row.id);
            this.$http.callApi(api,{
                data:{
                    is_recomend:row.is_recomend
                }
            }).then(res=>{
                this.$message.success('设置成功！');
                this.getPage();
            }).catch(err=>{});
        },
        clickDeletedSwitch(row){
            let api = this.$http.api.good.updateDeleted(row.id);
            this.$http.callApi(api,{
                data:{
                    deleted:row.deleted
                }
            }).then(res=>{
                this.$message.success('设置成功！');
                this.getPage();
            }).catch(err=>{
                row.deleted = true;
            });
        },
        clickSubmit(row){
            this.$confirm("确定提交审核吗？").then(_=>{
                let api = this.$http.api.good.submit(row.id);
                this.$http.callApi(api).then(res=>{
                    this.$message.success('提交成功！');
                    this.getPage();
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(_=>{
                console.log("不提交");
            });
        },
        clickAudit(row){
            let audit = (state) => {
                let api = this.$http.api.good.audit(row.id);
                this.$http.callApi(api,{
                    data:{ state }
                }).then(res=>{
                    this.$message.success('审核完成！');
                    this.getPage();
                }).catch(err=>{
                    console.log(err);
                });
            }
            this.$confirm("确定通过或拒绝该条商品的审核吗？",{
                confirmButtonText: "通过",
                cancelButtonText: "拒绝",
            }).then(_=>{
                audit(2);
            }).catch(_=>{
                audit(3);
            });
        }
    },
    computed:{
        rights(){
            return this.$store.state.rights.goods.list;
        }
    },
    components:{
        DataTable,GoodDetail
    }
};