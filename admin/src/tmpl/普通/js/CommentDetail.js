export default {
    name: "CommentDetail",
    data() {
        return {
            thisID: null,
            thisData: {},
            rules: {
                order_id:[
                    { required: true, message: "请输入订单id", trigger: "blur" }
                ],
                order_code:[
                    { required: true, message: "请输入订单编号", trigger: "blur" }
                ],
                user_id:[
                    { required: true, message: "请输入用户id", trigger: "blur" }
                ],
                user_name:[
                    { required: true, message: "请输入用户名称", trigger: "blur" }
                ],
                content:[
                    { required: true, message: "请输入评价内容", trigger: "blur" }
                ],
                overall_rating:[
                    { required: true, message: "请输入综合评分", trigger: "blur" }
                ],
                good_rating:[
                    { required: true, message: "请输入商品描述评分", trigger: "blur" }
                ],
                delivery_rating:[
                    { required: true, message: "请输入物流评分", trigger: "blur" }
                ],
                service_rating:[
                    { required: true, message: "请输入服务评分", trigger: "blur" }
                ],
            }
        };
    },  
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.comment.getByID(id);
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
            this.$refs.commentDetailForm.validate((valid) => {
                if (valid) {
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.comment.update(this.thisID);
                    } else {
                        api = this.$http.api.comment.insert();
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
            this.$refs.commentDetailForm.resetFields();
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