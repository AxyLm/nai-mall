export default {
    name: "Member",
    data() {
        return {
            tableData: [],
            queryInfo:{
                pagesize:10,
                pagenum:1,
                totalCount:0,
            },
            filterData:{ 
                order:"-add_time",
            },
            filters: {
                isDelete: this.$enums.Delete_Status.ToArray(),
            },
            createDateRange: [],
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
            let api = this.$http.api.member.getPage();
            this.$http.callApi(api,{
                params:{pagenum, pagesize},
                data:this.filterData
            }).then(res=>{
                this.tableData = res.data.member;
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
        clickDeletedSwitch(row){
            let api = this.$http.api.member.updateDeleted(row.id);
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
            return this.$store.state.rights.users.members;
        }
    },
};