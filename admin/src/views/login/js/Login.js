export default {
	name:"Login",
	data(){
		return {
			loginForm:{
				username:"admin",
				password:"123456"
			},
			loginRules:{
				username:[
					{required:true,message:'请输入账号',trigger:'blur' }
				],
				password:[
					{required:true,message:'请输入密码',trigger:'blur' }
				]
			}
		}
	},
	methods:{
		submit(){
			this.$refs.fm.validate(res=>{
				if(res){
					let username = this.loginForm.username;
					let password = this.loginForm.password;
					this.$store.dispatch("Login",{username,password}).then(results => {
						this.$message({
							type:"success",
							message:"登陆成功",
							duration:600
						});
						setTimeout(_=>this.$router.push("/"),600);
					}).catch(err=>{
						this.$store.commit('handleLogout');
					});
				}
			});
		}
	}
}