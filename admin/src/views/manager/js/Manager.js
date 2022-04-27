import ManagerDetail from "../ManagerDetail";
export default {
    name: "Manager",
    data() {
        return {
            tableData: [],
            checkedList:[],
            currentRow:{},
            loading: true,
            queryInfo:{
                pagesize:20,
                pagenum:1,
                totalCount:0,
            },
            filterData:{ 
                order:"id",
            },
            filters: {
                isDelete: this.$enums.Delete_Status.ToArray(),
            },
            createDateRange: [],
            showDetail: false,
            showRole: false,
            roleID: null,
            rolesList: []
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
            let api = this.$http.api.managers.getPage(pagenum, pagesize);
            this.$http.callApi(api,{
                data:this.filterData
            }).then(res=>{
                this.tableData = res.data.managers;
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
            this.filterData.search_input = val;
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
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
		timeFilterReset(type, row) {
			if (type == "create") {
				this.createDateRange = [];
				this.filterData.add_time = null;
				this.$refs.createDateRangePop.doClose();
			}
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
        checkboxChange(val){
            this.checkedList = val.map(it=>it.id);
        },
        // 增加和修改操作
        clickAdd(){ 
            this.modelTitle = "用户 - 新建";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.managerDetail.init();
            });
        },
        clickEdit(row){ 
            this.modelTitle = "用户 - 修改";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.managerDetail.init(row.id);
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
                let api = this.$http.api.managers.delete(row.id);
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
            let api = this.$http.api.managers.batchDelete();
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
            let api = this.$http.api.managers.updateDeleted(row.id);
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
        clickSetRole(row){ 
            this.showRole = true;
            this.currentRow = row;
            let api = this.$http.api.roles.getAll();
            this.$http.callApi(api).then(res=>{
                this.rolesList = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        clickSaveRole(){
            if (!this.roleID) {
                return this.$message.error('请选择要分配的权限');
            }
            let api = this.$http.api.managers.updateRole(this.currentRow.id);
            this.$http.callApi(api,{
                data:{
                    role_id: this.roleID
                }
            }).then(res => {
                this.$message.success('更新角色成功！');
                this.getPage();
                this.showRole = false;
            }).catch(err=>{
                console.log(err);
            });
        },
        clickCloseRole(){
            this.currentRow = {};
            this.roleID = null;
        }
    },
    computed:{
        rights(){
            return this.$store.state.rights.users.managers;
        }
    },
    components:{
        ManagerDetail
    }
};