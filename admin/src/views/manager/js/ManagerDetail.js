export default {
    name: "ManagerDetail",
    data() {
        let that = this;
        return {
            thisID: null,
            thisData: {
                name:"",
                password:"",
                email:"",
                mobile:""
            },
            rules: {
                name:[
                    {required:true,message:"请输入用户名",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入密码",trigger:"blur"}
                ],
                email:[
                    { validator: that.$valid.checkEmail, trigger: 'blur' },
                ],
                mobile:[
                    { validator: that.$valid.checkPhone, trigger: 'blur' },
                ]
            }
        };
    },  
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.managers.getByID(id);
                this.$http.callApi(api).then(res=>{
                    this.thisData = res.data;
                    this.rules.password[0].required = false;
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
            this.$refs.managerDetailForm.validate((valid) => {
                if (valid) {
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.managers.update(this.thisID);
                    } else {
                        api = this.$http.api.managers.insert();
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
            this.$refs.managerDetailForm.resetFields();
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