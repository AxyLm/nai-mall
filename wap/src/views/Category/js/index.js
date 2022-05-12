export default {
    name:"category",
    data(){
        return {
            catlist:[],
            goodlist:[],
            active: 0,
            finished: false,
            loading: false,
            error: false,
            refreshing:false,
            isLoading:false,
            curCatId:null,
            queryInfo:{
                pagenum:1,
                pagesize:6
            }
        }
    },
    methods:{
        getcatlist(){
            let api = this.$http.api.category.getTree();
            this.$http.callapi(api).then(res=>{
                this.catlist = res.data || [];
                //获取默认分类id
                this.curCatId = res.data[this.active].id
                this.getgoodlist()
            })
            
        },
        getgoodlist(){
            let {pagenum,pagesize} = this.queryInfo
            let api = this.$http.api.good.getPage(pagenum,pagesize);
            this.$http.callapi(api,{
                data:{ cat_one_id:this.curCatId}
            }).then(res=>{
                if(this.isLoading){
                    this.goodlist=[]
                    this.isLoading = false
                }
                this.goodlist.push(...res.data.good)
                this.loading = false;
                if(this.goodlist.length >= res.data.total){
                    this.finished = true;
                }else{
                    this.queryInfo.pagenum++;
                }
            }).catch(err=>{
                this.loading = false;
                this.error = true;
            })
        },
        onRefresh(){
            this.queryInfo.pagenum = 1
            this.getgoodlist()
        },
        onchange(){
            this.curCatId =  this.catlist[this.active].id;
            this.goodlist = [];
            this.queryInfo.pagenum = 1;
            this.getgoodlist();
        }
    },
    created(){
        this.getcatlist()
        // this.getgoodlist()
    }
}