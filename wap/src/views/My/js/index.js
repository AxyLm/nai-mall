export default {
    name:"my",
    created(){
        //  this.$store.dispatch("GetMe")
    },
    methods:{
      onLoginCllick(){
        this.$router.push('/login')
      },
      onLogout(){
        this.$dialog.confirm({
        title: '退出登录',
        message: '您确定要退出登录吗？',
        }).then(() => {
            this.$store.commit("handleLogout");
        }).catch(() => {});
      }
    },
    computed:{
        isLogin(){
            let tokenBox = this.$store.state.token;
            return !!(tokenBox && tokenBox.access_token);
        },
        me(){
            return this.$store.state.me;
        }
    }
}