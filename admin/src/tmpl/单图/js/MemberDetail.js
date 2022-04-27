export default {
    name: "MemberDetail",
    data() {
        return {
            thisID: null,
            thisData: { },
            rules: {
                telephone:[
                    {required:true,message:"请输入手机号码",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入密码",trigger:"blur"}
                ],
                nick_name:[
                    {required:true,message:"请输入昵称",trigger:"blur"}
                ],
            }
        };
    },  
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.member.getByID(id);
                this.$http.callApi(api).then(res=>{
                    let data = JSON.parse(JSON.stringify(res.data));
                    data.avatar = data.avatar ? [{url:data.avatar}]:[];
                    this.thisData = data;
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
            this.$refs.memberDetailForm.validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.thisData));
                    data.avatar = !this.$utils.isEmpty(data.avatar) && data.avatar.length ? data.avatar[0].url : null;
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.member.update(this.thisID);
                    } else {
                        api = this.$http.api.member.insert();
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
            this.$refs.memberDetailForm.resetFields();
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