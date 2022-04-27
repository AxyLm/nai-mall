import RolesDetail from "../RolesDetail.vue";
export default {
    name: "Users",
    data() {
        return {
            tableData: [],
            checkedList:[],
            currentRow:{},
            loading: true,
            filterData:{ 
                order:"-id",
            },
            filters: {
                isDelete: this.$enums.Delete_Status.ToArray(),
            },
            showDetail: false,
            showRights: false,
            rightsList: [],
            defRightKeys:[]
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
            let api = this.$http.api.roles.getAll();
            this.$http.callApi(api,{
                data: this.filterData
            }).then(res=>{
                res.data.forEach(item=>{
                    item.child = item.children;
                    delete item.children;
                });
                this.tableData = Object.freeze(res.data);
            }).catch(err=>{
                console.log(err);
            });
        },
        searchChange(val){ 
            this.filterData.name = val;
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
            this.getPage();
        },
        checkboxChange(val){
            this.checkedList = val.map(it=>it.id);
        },
        // 增加和修改操作
        clickAdd(){ 
            this.modelTitle = "角色 - 新建";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.rolesDetail.init();
            });
        },
        clickEdit(row){ 
            this.modelTitle = "角色 - 修改";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.rolesDetail.init(row.id);
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
                let api = this.$http.api.roles.delete(row.id);
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
            let api = this.$http.api.roles.batchDelete();
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
        clickDelRight(role, rightId) {
            this.$confirm("确定删除吗？").then(res => {
                let api = this.$http.api.roles.deleteRights(role.id);
                this.$http.callApi(api,{
                    data:{rightId}
                }).then(res => {
                    role.child = res.data;
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(err => {
                this.$message.info('取消了删除！');
            });
        },
        // 其他修改操作
        clickOpenRights(row){
            function getLeafKeys(node, arr) {
                let children = node.children || node.child;
                if (!children) {
                    return arr.push(node.id);
                }
                children.forEach(item => {
                    getLeafKeys(item, arr);
                });
            }
            this.currentRow = row;
            this.showRights = true;
            let api = this.$http.api.permission.getAllRights("tree");
            this.$http.callApi(api).then(res=>{
                this.rightsList = res.data;
            }).catch(err=>{
                console.log(err);
            });
            this.defRightKeys = [];
            getLeafKeys(row, this.defRightKeys);
        },
        clickSaveRights(){
            const key = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ];
            const idStr = key.join(',');
            let api = this.$http.api.roles.updateRights(this.currentRow.id);
            this.$http.callApi(api,{
                data:{
                    rights: idStr
                }
            }).then(res => {
                this.$message.success('分配权限成功！');
                this.getPage();
                this.showRights = false;
            }).catch(err=>{
                console.log(err);
            });
        },
        clickCloseRights(){
            this.currentRow = {};
        }
    },
    components:{
        RolesDetail
    }
};