export default{
    //授权接口
    auth:{
        login:function(username,password){
            return{
                method:"post",
                url:"/getToken",
                data:{
                    telephone:username,password
                }
            }
        },
        refresh:{

        }
    }
    //商品管理
    //地址管理
}