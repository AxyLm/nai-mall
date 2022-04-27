export default {
    name:"Config",
    data(){
        let that = this;
        return {
            thisData:{
                register_info:"",
                aftersale_info:"",
                server_tel:"",
                aftersale_tel:"",
            },
            rules: {
                server_tel:[
                    { validator: that.$valid.checkPhone, trigger: 'blur' },
                ],
                aftersale_tel:[
                    { validator: that.$valid.checkPhone, trigger: 'blur' },
                ],
            },
            activeIndex:'0',
        }
    },
    created() {
        this.getDetail();
    },
    methods: {
        getDetail(){
            let api = this.$http.api.config.getByID(1);
            this.$http.callApi(api).then(res=>{
                this.thisData = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        submitForm(){
            this.$refs.configForm.validate(valid=>{
                if (valid) {
                    let api = this.$http.api.config.update(1);
                    let data = JSON.parse(JSON.stringify(this.thisData));
                    this.$http.callApi(api, {
                        data: data,
                    }).then(res=>{
                        this.$message.success("修改成功！");
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            });
        }
    },
}