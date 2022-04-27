export default {
    name: "ProfileDetail",
    data() {
        let that = this;
        return {
            thisData: {
                name:"",
                pwd:"",
                email:"",
                mobile:"",
                avatar:"",
            },
            avatarArr:[],
            rules: {
                name:[
                    { required:true, message:"请输入用户名", trigger:"blur" }
                ],
                email:[
                    { validator: that.$valid.checkEmail, trigger: 'blur' },
                ],
                mobile:[
                    { validator: that.$valid.checkPhone, trigger: 'blur' },
                ],
                pwd:[
                    { validator:(rule, value, callback)=>{
                        if(value || this.thisData.newPwd){
                            this.$refs.profileDetailForm.validateField('newPwd');
                        }else{
                            this.$refs.profileDetailForm.clearValidate();
                        }
                        callback()
                    }, trigger: 'blur' }
                ],
                newPwd:[
                    { validator:(rule, value, callback)=>{
                        if(value!=this.thisData.pwd){
                            return callback(new Error('两次密码不一致！'));
                        }else{
                            return callback();
                        }
                    }, trigger: 'blur' }
                ],
            }
        };
    },  
    created() {
        this.init();
    },
    methods: {
        //初始化
        init() {
            let api = this.$http.api.managers.getMe();
            this.$http.callApi(api).then(res=>{
                if(res.data.avatar){
                    this.avatarArr.push({
                        url: res.data.avatar
                    });
                }
                this.thisData = res.data;
                this.resetBtn();
            }).catch(err=>{
                console.log(err);
            });
        },
        //提交表单
        submitForm() {
            this.$refs.profileDetailForm.validate((valid) => {
                if (valid) {
                    if(this.avatarArr.length){
                        this.thisData.avatar = this.avatarArr[0].url;
                    }
                    let  api = this.$http.api.managers.update(this.thisData.id);
                    this.$http.callApi(api, {
                        data: this.thisData,
                    }).then(res=>{
                        this.$store.dispatch("GetMe");
                        this.$message.success("修改成功！");
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            });
        },
        //重置表单
        resetForm() {
            this.$refs.profileDetailForm.resetFields();
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