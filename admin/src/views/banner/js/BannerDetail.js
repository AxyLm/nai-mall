export default {
    name: "BannerDetail",
    data() {
        return {
            thisID: null,
            thisData: { 
                sort:0
            },
            rules: {
                img_url:[
                    {required:true,message:"请上传轮播图片",trigger:"blur"}
                ],
                target:[
                    {required:true,message:"请输入跳转目标地址",trigger:"blur"}
                ],
                sort:[
                    {required:true,message:"请输入序号",trigger:"blur"}
                ],
            },
            imgArr:[]
        };
    },  
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.banner.getByID(id);
                this.$http.callApi(api).then(res=>{
                    let data = JSON.parse(JSON.stringify(res.data));
                    data.img_url = data.img_url ? [{url:data.img_url}]:[];
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
            this.$refs.bannerDetailForm.validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.thisData));
                    data.img_url = !this.$utils.isEmpty(data.img_url) && data.img_url.length ? data.img_url[0].url : "";
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.banner.update(this.thisID);
                    } else {
                        api = this.$http.api.banner.insert();
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
            this.$refs.bannerDetailForm.resetFields();
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