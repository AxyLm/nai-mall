export default {
    name: "PayDetail",
    data() {
        return {
            thisID: null,
            thisData: { 
                sort:0
            },
            rules: {
                name:[
                    { required: true, message: "请输入支付方式名称", trigger: "blur" }
                ],
                sort:[
                    { required: true, message: "请输入排序号", trigger: "blur" }
                ],
            }
        };
    },  
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.configPay.getByID(id);
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
        //提交表单
        submitForm() {
            this.$refs.payDetailForm.validate((valid) => {
                if (valid) {
                    let api,data=JSON.parse(JSON.stringify(this.thisData));
                    if (this.thisID) {
                        api = this.$http.api.configPay.update(this.thisID);
                    } else {
                        api = this.$http.api.configPay.insert();
                    }
                    this.$http.callApi(api, {
                        data: data,
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
            this.$refs.payDetailForm.resetFields();
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