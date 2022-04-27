import GoodAttrDetail from "../GoodAttrDetail.vue";
export default {
    name: "GoodAttr",
    data() {
        return {
            cateList: [],
            selectedCateKeys: [],
            activeName: "dynamic",
            dynamicTableData: [],
            staticTableData: [],
            showDetail: false,
            modelTitle: "",
        };
    },
    created(){
        this.init();
    },
    methods:{
        init() { 
            this.getCateList();
        },
        // 事件监听
        catChange(val) {
            if (this.selectedCateKeys.length) {
                this.getParamsData();
            }
        },
        tabClick() {
            if (this.selectedCateKeys.length) {
                this.getParamsData();
            }
        },
        showInput(row) {
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        inputConfirm(row) {
            if (row.inputValue.trim().length == 0) {
                row.inputValue = '';
                row.inputVisible = false;
                return;
            }
            row.vals.push(row.inputValue.trim());
            row.inputValue = '';
            row.inputVisible = false;
            this.saveAttrVals(row);
        },
        clickAdd() {
            this.modelTitle = this.titleText + " - 新建";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodAttrDetail.init(this.cateId,this.activeName);
            });
        },
        clickEdit(id) {
            this.modelTitle = this.titleText + " - 修改";
            this.showDetail = true;
            this.$nextTick(_=>{
                this.$refs.goodAttrDetail.init(null, null, id);
            });
        },
        clickCloseDetail(flag) {
            this.showDetail = false;
            if (flag) {
                this.getParamsData();
            }
        },
        clickDelAttr(id) {
            this.$confirm('确认要删除吗？？？').then(res => {
                let api = this.$http.api.categoryAttr.delete(id);
                this.$http.callApi(api).then(res => {
                    this.$message.success('删除参数成功！！！');
                    this.getParamsData();
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(err => {
                return this.$message.info('取消删除操作');
            });
        },
        clickDelAttrVal(index, row) {
            row.vals.splice(index, 1);
            this.saveAttrVals(row);
        },
        // 数据获取
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
        getParamsData() {
            let api = this.$http.api.categoryAttr.getAll();
            this.$http.callApi(api, {
                params: {
                    catID:this.cateId,
                    type: this.activeName,
                },
            }).then(res => {
                res.data.forEach(item => {
                    item.vals = item.vals ? item.vals.split(',') : [];
                    item.inputVisible = false;
                    item.inputValue = '';
                });
                if (this.activeName == 'dynamic') {
                    this.dynamicTableData = res.data;
                } else {
                    this.staticTableData = res.data;
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        // 数据保存
        saveAttrVals(row) {
            let api = this.$http.api.categoryAttr.update(row.id);
            this.$http.callApi(api, {
                data:{vals: row.vals.join(',')},
            }).then(res => {
                this.$message.success('修改参数项成功！！！');
            }).catch(err=>{
                console.log(err);
            });
        },
    },
    components:{
        GoodAttrDetail
    },
    computed: {
        isBtnDisabled() {
            if (!this.selectedCateKeys.length) {
                return true;
            }
            return false;
        },
        cateId() {
            let sKeys = this.selectedCateKeys;
            if (sKeys.length) {
                return sKeys[sKeys.length-1];
            }
            return null;
        },
        titleText() {
            if (this.activeName == 'dynamic') {
                return '动态参数';
            }
            return '静态属性';
        },
    }
};