export default {
    name: "GoodDetail",
    data() {
        return {
            thisID: null,
            thisData: {
                name:"",
                price:"",
                weight:"",
                number:"",
                cat: [],
                attrs: [],
                pics: [],
                introduce: '',
                is_promote: false,
                promote_price: null,
            },
            fileList: [],
            rules: {
                name:[{required:true,message:"请输入商品名称",trigger:"blur"}],
                price:[{required:true,message:"请输入商品价格",trigger:"blur"}],
                weight:[{required:true,message:"请输入商品重量",trigger:"blur"}],
                number:[{required:true,message:"请输入商品数量",trigger:"blur"}],
                cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
            },
            activeIndex:'0',
            cateList:[],
            dynamicTableData:[],
            staticTableData:[]
        };
    },  
    created() {
        this.getCateList(); 
    },
    methods: {
        //初始化
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.good.getByID(id);
                this.$http.callApi(api).then(res=>{
                    this.thisData.name = res.data.name;
                    this.thisData.price = res.data.price;
                    this.thisData.weight = res.data.weight;
                    this.thisData.number = res.data.number;
                    this.thisData.is_promote = res.data.is_promote;
                    this.thisData.promote_price = res.data.promote_price;
                    this.thisData.cat = res.data.cat && res.data.cat.split(",").map(it=>parseInt(it));
                    for(let i=this.thisData.cat.length-1; i>=0;i--){
                        if(!this.thisData.cat[i]){
                            this.thisData.cat.splice(i,1);
                        }
                    }
                    if(res.data.attrs){
                        this.thisData.attrs =  res.data.attrs;
                    }
                    this.getDynamic();
                    this.getStatic();
                    if(res.data.pics){
                        this.thisData.pics = res.data.pics;
                        this.fileList = res.data.pics.map(item=>{
                            return {
                                url: item.sma_url,
                                id: item.id
                            }
                        });
                    }
                    this.thisData.introduce = res.data.introduce;
                    this.resetBtn();
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                this.resetBtn();
            }
        },
        // tab切换功能
        beforeChangeTab(activeName, oldActiveName) {
            if (oldActiveName == 0 && !this.thisData.cat.length) {
                this.$message.error('请选择商品分类！！！');
                return false;
            }
        },
        // 基本信息页签
        getCateList() {
            let api = this.$http.api.category.getTreeOrList();
            this.$http.callApi(api).then(res => {
                this.cateList = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        catChange(){
            if (this.thisData.cat.length) {
                this.getDynamic();
                this.getStatic();
            }
        },
        // 获取商品参数（dynamic）
        getDynamic(){
            let api = this.$http.api.categoryAttr.getAll();
            this.$http.callApi(api, {
                params: {
                    type: 'dynamic',
                    catID: this.cateId,
                },
            }).then(res => {
                res.data.forEach(item => {
                    item.vals = item.vals.length == 0 ? [] : item.vals.split(',');
                    let attr = this.thisData.attrs.find(it=>it.attr_id==item.id);
                    if(attr){
                        item.value = (!attr.value||attr.value.length == 0) ? [] : attr.value.split(',');
                    }else{
                        item.value = [];
                    }
                });
                this.dynamicTableData = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        // 获取商品属性（static）
        getStatic(){
            let api = this.$http.api.categoryAttr.getAll();
            this.$http.callApi(api, {
                params: {
                    type: 'static',
                    catID: this.cateId,
                },
            }).then(res => {
                res.data.forEach(item => {
                    let attr = this.thisData.attrs.find(it=>it.attr_id==item.id);
                    if(attr&&attr.value){
                        item.value = attr.value ;
                    }else{
                        item.value = item.vals;
                    }
                });
                this.staticTableData = res.data;
            }).catch(err=>{
                console.log(err);
            });
        },
        //提交表单
        submitForm() {
            this.$refs.goodDetailForm.validate((valid) => {
                if (valid) {
                    let api, data = JSON.parse(JSON.stringify(this.thisData));
                    if (this.thisID) {
                        api = this.$http.api.good.update(this.thisID);
                    } else {
                        api = this.$http.api.good.insert();
                    }
                    data.cat = data.cat.join(',');
                    // 处理动态参数
                    let newAttrs = [];
                    this.dynamicTableData.forEach(item => {
                        const newInfo = { id: item.id, value: item.value.join(',') };
                        newAttrs.push(newInfo);
                    });
                    //处理静态属性
                    this.staticTableData.forEach(item => {
                        const newInfo = { id: item.id, value: item.value };
                        newAttrs.push(newInfo);
                    });
                    data.attrs = newAttrs;
                    // 处理商品图片
                    data.pics = this.fileList.map(it=>{
                        let obj = {};
                        if(it.id) {
                            obj.id = it.id;
                        }else{
                            obj.pic = it.tmp_path;
                        }
                        return obj;
                    });
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
            this.$refs.goodDetailForm.resetFields();
        },
        // 初始化提交按钮
        resetBtn() {
            this.$store.commit("handleBtnDatas", {
                rules: this.rules,
                data: JSON.stringify(this.thisData)
            });
        }
    },
    computed: {
        cateId() {
            let sCats = this.thisData.cat;
            if (sCats.length) {
                return sCats[sCats.length-1];
            }
            return null;
        },
    }
}