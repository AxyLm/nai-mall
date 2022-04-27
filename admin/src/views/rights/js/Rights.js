export default {
    name: "Rights",
    data() {
        return {
            tableData: [],
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
        getPage(){
            let api = this.$http.api.permission.getAllRights("tree");
            this.$http.callApi(api).then(res=>{
                this.tableData = Object.freeze(res.data);
            }).catch(err=>{
                console.log(err);
            });
        },
    },
};