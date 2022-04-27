export default {
    name: "FreightDetail",
    data() {
        return {
            thisID: null,
            freightData: {
                name:"",
                good_addr_code:"",
                good_addr_info:"",
                delivery_time: 72,
                is_free: 1,
                price_method: null,
                specify_free_condition: null,
            },
            freightDeliveryData:{
                courier:{
                    title:"快递",
                    checked: false,
                    code: 0,
                    default:{
                        firstNo:null,
                        firstMoney:null,
                        secondNo:null,
                        secondMoney:null,
                    },
                    other:[]
                },
                ems:{
                    title:"ems",
                    checked: false,
                    code: 1,
                    default:{
                        firstNo:null,
                        firstMoney:null,
                        secondNo:null,
                        secondMoney:null,
                    },
                    other:[]
                },
                ordinary:{
                    title:"平邮",
                    checked: false,
                    code: 2,
                    default:{
                        firstNo:null,
                        firstMoney:null,
                        secondNo:null,
                        secondMoney:null,
                    },
                    other:[]
                }
            },
            freightConditionData:[],
            rules: {
                name:[
                    { required: true, message: "请输入模板名称", trigger: "blur" }
                ],
                good_addr_code:[
                    { required: true, message: "请选择宝贝地址", trigger: "blur" }
                ],
                delivery_time:[
                    { required: true, message: "请填写发货时间", trigger: "blur" }
                ],
                is_free:[
                    { required: true, message: "请选择是否包邮", trigger: "blur" }
                ],
                price_method:[
                    { required: false, message: "请选择是否包邮", trigger: "blur" }
                ],
            },
            activeIndex: ""
        };
    },
    methods: {
        /** 
         * 初始化
         */
        init(id) {
            if (id) {
                this.thisID = id;
                let api = this.$http.api.freight.getByID(id);
                this.$http.callApi(api).then(res=>{
                    this.initFreightDelivery(res.data.freight_delivery,res.data.price_method);
                    this.initFreightCondition(res.data.freight_condition);
                    this.initFreight(res.data);
                    this.resetBtn();
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                this.resetBtn();
            }
        },
        initFreightDelivery(deliverys,price_method){
            for(let key in this.freightDeliveryData){
                let wayItem = this.freightDeliveryData[key];
                let hasDelivery = deliverys.find(it=>it.delivery_way==wayItem.code);
                let defDelivery,otherDelivery;
                if(hasDelivery){
                    wayItem["checked"]=true;
                    defDelivery = deliverys.find(it=>it.delivery_way==wayItem.code&&it.is_default==1);
                    otherDelivery = deliverys.filter(it=>it.delivery_way==wayItem.code&&it.is_default==0);
                    wayItem["default"]["firstMoney"] = defDelivery.first_money;
                    wayItem["default"]["secondMoney"] = defDelivery.second_money;
                    if(price_method==0){
                        wayItem["default"]["firstNo"] = defDelivery.first_weight;
                        wayItem["default"]["secondNo"] = defDelivery.second_weight;
                    }
                    if(price_method==1){
                        wayItem["default"]["firstNo"] = defDelivery.first_piece;
                        wayItem["default"]["secondNo"] = defDelivery.second_piece;
                    }
                    if(price_method==2){
                        wayItem["default"]["firstNo"] = defDelivery.first_volume;
                        wayItem["default"]["secondNo"] = defDelivery.second_volume;
                    }
                    wayItem.other = otherDelivery.map(it=>{
                        let tmp = {
                            area_code: it.area_code&&it.area_code.split(","),
                            firstMoney: it.first_money,
                            secondMoney: it.second_money
                        }
                        if(price_method==0){
                            tmp["firstNo"] = it.first_weight;
                            tmp["secondNo"] = it.second_weight;
                        }
                        if(price_method==1){
                            tmp["firstNo"] = it.first_piece;
                            tmp["secondNo"] = it.second_piece;
                        }
                        if(price_method==2){
                            tmp["firstNo"] = it.first_volume;
                            tmp["secondNo"] = it.second_volume;
                        }
                        return tmp;
                    });
                }
            }
        },
        initFreightCondition(conditions){
            this.freightConditionData = conditions.map(it=>{
                let tmp = {
                    area_code: it.area_code&&it.area_code.split(","),
                    delivery_way: it.delivery_way,
                    condition: it.condition,
                };
                if(it.condition=="weight") tmp.conditionNo = it.weight_no;
                if(it.condition=="piece") tmp.conditionNo = it.piece_no;
                if(it.condition=="volume") tmp.conditionNo = it.volume_no;
                if(it.condition=="money") tmp.conditionMoney = it.money;
                if(it.condition=="weight-money") {
                    tmp.conditionNo = it.weight_no;
                    tmp.conditionMoney = it.money;
                }
                if(it.condition=="piece-money") {
                    tmp.conditionNo = it.piece_no;
                    tmp.conditionMoney = it.money;
                }
                if(it.condition=="volume-money") {
                    tmp.conditionNo = it.volume_no;
                    tmp.conditionMoney = it.money;
                }
                return tmp;
            });
        },
        initFreight(data){
            delete data.freight_delivery;
            delete data.freight_condition;
            this.freightData = data;
        },
        /**
         * 运费模板：基本信息管理
         */
        // 1.是否包邮单选框切换
        isFreeChange(value){
            if(value==0){
                this.rules.price_method[0].required = true;
            }else{
                this.rules.price_method[0].required = false;
                this.freightData.price_method = null;
                this.freightData.specify_free_condition = null;
            }
        },
        // 2.tab切换限制
        beforeChangeTab(activeName, oldActiveName) {
            if (oldActiveName == 0 && this.freightData.price_method===null) {
                this.$message.error('请首先选择计价方式！！！');
                return false;
            }
            if(activeName==2){
                this.setTableColspan();
            }
        },
        setTableColspan(){
            var t2 = this.$refs.t2.$el;
            var th = t2.querySelector(".el-table__header").rows[0].cells;
            th[2].colSpan = 2;
            th[3].style.display = 'none';
        },
        /** 
         * 运费模板：运送方式管理
         */
        // 1.运送方式复选框切换
        freightDeliveryChange(way){

        },
        // 2.添加指定地区运费
        addDeliveryOther(way){
            way.other.push({
                area_code:[],
                firstNo:null,
                firstMoney:null,
                secondNo:null,
                secondMoney:null,
            });
        },
        // 3.删除指定地区运费
        delDeliveryOther(way,index){
            way.other.splice(index,1);
        },
        /** 
         * 运费模板：包邮条件管理 
         */
        // 1.添加包邮条件
        addConditionData(){
            this.freightConditionData.push({
                area_code: [],
                delivery_way: null,
                condition: "",
                conditionNo: null,
                conditionMoney: null
            });
        },
        // 2.删除包邮条件
        delConditionData(index){
            this.freightConditionData.splice(index,1);
        },
        // 3.包邮条件改变
        conditionChange(row){
            row.conditionNo = null;
            row.conditionMoney = null;
        },
        /** 
         * 组织数据和提交表单
         */
        // 1.组织运送方式数据
        organizeDeliveryData(data){
            data.freight_delivery = [];
            // key => courier/ems/ordinary
            for(let key in this.freightDeliveryData){
                let wayItem = this.freightDeliveryData[key];
                if(wayItem["checked"]){
                    // 验证默认运费
                    for(let key2 in wayItem["default"]){
                        if(this.$utils.isEmpty(wayItem["default"][key2])){
                            return false;
                        }
                    }
                    // 验证指定地区运费
                    for(let i = 0; i<wayItem["other"].length; i++){
                        let otherItem = wayItem["other"][i];
                        for(let key3 in otherItem){
                            if(
                                this.$utils.isEmpty(otherItem[key3]) || 
                                Array.isArray(otherItem[key3])&&
                                !otherItem[key3].length
                            ){
                                return false;
                            }
                        }
                    }
                    // 默认运费数据
                    let def =  {
                        first_money:wayItem["default"].firstMoney,
                        second_money:wayItem["default"].secondMoney,
                        delivery_way:wayItem["code"],
                        is_default:1,
                    }
                    if(this.freightData.price_method==0){
                        def["first_weight"] = wayItem["default"].firstNo;
                        def["second_weight"] = wayItem["default"].secondNo;
                    }
                    if(this.freightData.price_method==1){
                        def["first_piece"] = wayItem["default"].firstNo;
                        def["second_piece"] = wayItem["default"].secondNo;
                    }
                    if(this.freightData.price_method==2){
                        def["first_volume"] = wayItem["default"].firstNo;
                        def["second_volume"] = wayItem["default"].secondNo;
                    }
                    data.freight_delivery.push(def);
                    // 指定地区运费数据
                    let other = wayItem.other.map((it,index)=>{
                        let tmp = {
                            area_code:it.area_code.join(","),
                            area_info:this.$refs["area"+wayItem.code+""+index][0].getLabel().join(","),
                            first_money:it.firstMoney,
                            second_money:it.secondMoney,
                            delivery_way:wayItem["code"],
                            is_default:0,
                        }
                        if(this.freightData.price_method==0){
                            tmp["first_weight"] = it.firstNo;
                            tmp["second_weight"] = it.secondNo;
                        }
                        if(this.freightData.price_method==1){
                            tmp["first_piece"] = it.firstNo;
                            tmp["second_piece"] = it.secondNo;
                        }
                        if(this.freightData.price_method==2){
                            tmp["first_volume"] = it.firstNo;
                            tmp["second_volume"] = it.secondNo;
                        }
                        return tmp;
                    });
                    data.freight_delivery.push(...other);
                }
            }
            return data;
        },
        // 2.组织包邮条件数据
        organizeConditionData(data){
            for(let i = 0; i<this.freightConditionData.length; i++){
                let item = this.freightConditionData[i];
                if(
                    this.$utils.isEmpty(item["area_code"]) || 
                    Array.isArray(item["area_code"])&&
                    !item["area_code"].length
                ){
                    return false;
                }
                if(
                    (item.condition=="money" || 
                    item.condition=="weight-money" ||
                    item.condition=="piece-money" ||
                    item.condition=="volume-money") &&
                    this.$utils.isEmpty(item["conditionMoney"])
                ){
                    return false;
                }
                if(
                    this.$utils.isEmpty(item["delivery_way"]) ||
                    this.$utils.isEmpty(item["conditionNo"])
                ){
                    return false;
                }
            }
            this.freightData.specify_free_condition && (data.freight_condition = this.freightConditionData.map((it,index)=>{
                let tmp = {
                    area_code: it.area_code.join(","),
                    area_info:this.$refs["area3"+index].getLabel().join(","),
                    delivery_way: it.delivery_way,
                    condition: it.condition
                }
                if(it.condition=="weight") tmp.weight_no = it.conditionNo;
                if(it.condition=="piece") tmp.piece_no = it.conditionNo;
                if(it.condition=="volume") tmp.volume_no = it.conditionNo;
                if(it.condition=="money") tmp.money = it.conditionMoney;
                if(it.condition=="weight-money"){
                    tmp.weight_no = it.conditionNo;
                    tmp.money = it.conditionMoney;
                }
                if(it.condition=="piece-money"){
                    tmp.piece_no = it.conditionNo;
                    tmp.money = it.conditionMoney;
                }
                if(it.condition=="volume-money"){
                    tmp.volume_no = it.conditionNo;
                    tmp.money = it.conditionMoney;
                }
                return tmp;
            }));
            return data;
        },
        // 3.提交数据
        submitForm() {
            this.$refs.freightForm.validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.freightData));
                    data.good_addr_info = this.$refs.goodArea.getLabel();
                    let res1 = this.organizeDeliveryData(data);
                    let res2 = this.organizeConditionData(data);
                    if(!res1) return this.$message.error("请检查运送方式数据是否有漏填！");
                    if(!res2) return this.$message.error("请检查包邮条件数据是否有漏填！");
                    let api;
                    if (this.thisID) {
                        api = this.$http.api.freight.update(this.thisID);
                    } else {
                        api = this.$http.api.freight.insert();
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
        /** 
         * 其他方法
         */
        // 1.关闭
        close() {
            this.$emit("close");
        },
        // 2.重置表单
        resetForm() {
            this.$refs.freightForm.resetFields();
        },
        // 3.重置提交按钮
        resetBtn() {
            this.$store.commit("handleBtnDatas", {
                rules: this.rules,
                data: JSON.stringify(this.freightData)
            });
        }
    }
}