export default {
    name: "GoodCatDetail",
    data() {
        return {
            thisID: null,
            thisData: {
                name:"",
                pid: 0,
                level: 0
            },
            rules: {
                name:[
                    {required:true,message:"请输入用户名",trigger:"blur"}
                ]
            },
            parentCateList: [],
            selectedCates: [],
        };
    },  
    methods: {
        //初始化
        init(id) {
            this.getParentCateList();
            if (id) {
                this.thisID = id;
                let api = this.$http.api.category.getByID(id);
                this.$http.callApi(api).then(res=>{
                    this.thisData = res.data;
                    this.resetBtn();
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                this.resetBtn();
            }
        },
        getParentCateList() {
            let api = this.$http.api.category.getTreeOrList();
            this.$http.callApi(api,{
                data:{
                    type: 2
                }
            }).then(res => {
                this.parentCateList = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        onCatChange() {
            console.log(this.selectedCates);
            // 如果selectedCates数据中 length 大于0  证明选中了父级分类；
            if (this.selectedCates.length > 0) {
                // 父级分类的id
                this.thisData.pid = this.selectedCates[this.selectedCates.length - 1];
                //为当前分类的等级赋值
                this.thisData.level = this.selectedCates.length;
                return;
            } else {
                this.thisData.pid = 0;
                this.thisData.level = 0;
            }
        },
        //提交表单
        submitForm() {
            this.$refs.goodCatDetailForm.validate((valid) => {
                if (valid) {
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.category.update(this.thisID);
                    } else {
                        api = this.$http.api.category.insert();
                    }
                    this.$http.callApi(api, {
                        data: this.thisData,
                    }).then(res=>{
                        res.meta.status==200 && this.$message.success("修改成功！");
                        res.meta.status==201 && this.$message.success("创建成功！");
                        this.$emit("close", true);
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            });
        },
        //关闭
        close() {
            this.$emit("close");
        },
        //重置表单
        resetForm() {
            this.$refs.goodCatDetailForm.resetFields();
        },
        // 初始化提交按钮
        resetBtn() {
            this.$store.commit("handleBtnDatas", {
                rules: this.rules,
                data: JSON.stringify(this.thisData)
            });
        }
    }
}