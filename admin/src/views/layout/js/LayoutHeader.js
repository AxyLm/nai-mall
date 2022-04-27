export default { 
    name: "Header",
    data(){
        return {
            isFolded: false
        }
    },
    methods:{
        toggleMenu(){
            this.isFolded = !this.isFolded;
            if(this.isFolded){
                document.body.classList.add("folded");
            }else{
                document.body.classList.remove("folded");
            }
            this.$store.commit("changeMenuFolded",this.isFolded);
        },
        logout(){
            this.$confirm("确定退出吗？",{
                iconClass:"fa fa-sign-out"
            }).then(_=>{
                this.$store.commit("handleLogout");
                this.$router.push("/login");
                console.log("确定");
            }).catch(_=>{
                console.log("取消");
            });
        }
    }
}