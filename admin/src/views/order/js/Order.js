import DataTable from "cmps/table/DataTable";
export default {
    name: "Order",
    data() {
        return {
            tableData: [],
            checkedList:[],
            queryInfo:{
                pagesize:10,
                pagenum:1,
                totalCount:0,
            },
            filterData:{ 
                order:"-id",
            },
            createDateRange: [],
            filters: {
                payType: this.$enums.Pay_Type.ToArray(),
                deliveryType: this.$enums.Delivery_Type.ToArray(),
                status: this.$enums.Order_Status.ToArray(),
            },
            // 物流进度
            showDeliveryProcess: false,
            timeList: [],
            // 订单商品
            showGoods: false,
            goodsList: [],
            // 订单价格
            currentRow: {},
            showUpdPrice: false,
            priceFormData:{
                total_money: null,
            },
            priceFormRules:{
                total_money:[
                    { required:true, message:"价格为必填项", trigger:"blur" }
                ]
            },
            // 订单发货
            showDelivery: false,
            deliveryFormData:{
                company:"",
                number:""
            },
            deliveryFormRules:{
                company:[
                    { required:true, message:"快递公司为必选项", trigger:"blur" }
                ],
                number:[
                    { required:true, message:"快递单号为必填项", trigger:"blur" }
                ],
            },
            // 查看评价
            showComment: false
        };
    },
    created(){
        this.init();
    },
    methods:{
        // 初始化下拉列表数据
        init(){
            this.getPage();
        },
        // 列表数据查询和筛选
        getDetail(id,cb){
            let api = this.$http.api.order.getByID(id);
            this.$http.callApi(api).then(res=>{
                cb(res.data);
            }).catch(err=>{
                console.log(err);
            });
        },
        getPage(){
            let pagenum = this.queryInfo.pagenum;
            let pagesize = this.queryInfo.pagesize;
            let api = this.$http.api.order.getPage(pagenum, pagesize);
            this.$http.callApi(api,{
                params:{ pagenum, pagesize },
                data:this.filterData
            }).then(res=>{
                this.tableData = res.data.order;
                this.queryInfo.totalCount = res.data.total;
            }).catch(err=>{
                console.log(err);
            });
        },
        pageChange(val){ 
            this.queryInfo.pagenum = val;
            this.getPage();
        },
        sizeChange(val){ 
            this.queryInfo.pagesize = val;
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        searchChange(val){ 
            this.filterData.search_input = val;
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        sortChange(column) {
            if (column.order == null) {
                return;
            }
            if (column.order == "descending") {
                this.filterData.order =column.prop;
            } else if (column.order == "ascending") {
                this.filterData.order =  "-"+column.prop;
            }
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        filterChange(filters) {
            let key = Object.keys(filters)[0];
            let value = filters[key].length > 0 ? filters[key] : null;
            if(value){
                this.$set(this.filterData, key, value);
            }else{
                delete this.filterData[key];
            }
            this.queryInfo.pagenum = 1;
            this.getPage();
        },
        timeFilterChange(type, row) {
			if (type == "create") {
				if (this.createDateRange.length == 2) {
					this.filterData.add_time = this.createDateRange;
				}
				this.$refs.createDateRangePop.doClose();
			}
			if (type == "update") {
				if (this.updateDateRange.length == 2) {
					this.filterData.upd_time = this.updateDateRange;
				}
				this.$refs.updateDateRangePop.doClose();
			}
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
		timeFilterReset(type, row) {
			if (type == "create") {
				this.createDateRange = [];
				this.filterData.add_time = null;
				this.$refs.createDateRangePop.doClose();
			}
			if (type == "update") {
				this.updateDateRange = [];
				this.filterData.upd_time = null;
				this.$refs.updateDateRangePop.doClose();
			}
            this.queryInfo.pagenum = 1;
			this.getPage();
		},
        // 关闭订单
        clickCloseOrder(row){
            this.$confirm("确定关闭吗？").then(_=>{
                let api = this.$http.api.order.closeOrder(row.id);
                this.$http.callApi(api).then(res=>{
                    this.$message.success('关闭成功！');
                    this.getPage();
                }).catch(err=>{
                    console.log(err);
                });
            }).catch(_=>{
                console.log("不关闭");
            });
        },
        // 修改价格
        clickShowPrice(row){
            this.currentRow = row;
            this.priceFormData.total_money = row.total_money;
            this.showUpdPrice = true;
        },
        clickHidePrice(){
            this.currentRow = {};
            this.priceFormData.total_money = null;
            this.showUpdPrice = false;
        },
        clickSetPrice(){
            this.$refs.priceForm.validate((valid) => {
                if(valid){
                    let api = this.$http.api.order.updatePrice(this.currentRow.id);
                    this.$http.callApi(api,{
                        data:{
                            total_money: this.priceFormData.total_money
                        }
                    }).then(res=>{
                        this.clickHidePrice();
                        this.getPage();
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            });
        },
        // 发货和快递查看
        clickShowDelivery(row){
            this.currentRow = row;
            this.showDelivery = true;
        },
        clickHideDelivery(){
            this.currentRow = {};
            this.showDelivery = false;
        },
        clickSendDelivery(){
            this.$refs.deliveryForm.validate((valid) => {
                if(valid){
                    let api = this.$http.api.order.updateDelivery(this.currentRow.id);
                    let data = JSON.parse(JSON.stringify(this.deliveryFormData));
                    this.$http.callApi(api,{ data }).then(res=>{
                            this.clickHideDelivery();
                            this.getPage();
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            });
        },
        clickShowProgress(row) {
            this.getDetail(row.id,data=>{
                let deliveryCode = data.delivery && data.delivery.number;
                if(deliveryCode){
                    let api = this.$http.api.delivery.process(deliveryCode);
                    this.$http.callApi(api).then(res => {
                        this.timeList = res.data;
                        this.showDeliveryProcess = true;
                    }).catch(err=>{
                        console.log(err);
                    });
                }else{
                    this.$message.error("快递信息不存在！");
                }
            });
        },
        // 订单商品查看
        clickShowGoods(row) {
            this.getDetail(row.id,data=>{
                this.goodsList = data.good || [];
            });
            this.showGoods = true;
        },
        orderGoodsSummaries(param){
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                // 第一列
                if (index === 0) {
                    sums[index] = '总价';
                // 最后一列
                } else if (index === columns.length - 1) {
                    const values = data.map(item => item.good_count*item.good_price);
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = '';
                    }
                // 中间列
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        },
        // 查看评价
        clickShowComment(row){
            this.currentRow = row;
            this.showComment = true;
        },
        clickHideComment(){
            this.currentRow = {};
            this.showComment = false;
        },
    },
    components:{
        DataTable
    }
};