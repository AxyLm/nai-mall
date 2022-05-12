export default {
    //授权接口
    auth: {
        login: function (username, password) {
            return {
                method: "post",
                url: "/getToken",
                data: {
                    telephone: username, password
                },
                hasToken:false
            }
        },
        refresh: {

        }
    },
    member: {
        getMe() {
            return {
                method: "get",
                url: "/member/getMe",
            }
        },
        register(){
            return {
                method:"post",
                url:"/member/register",
                hasToken:false
            }
        }
    },
    banner:{
        getBanner(){
            return {
                method:"get",
                url:"/banner/getList",
                hasToken:false
            }
        }
    },
    good:{
        getPage(pagenum,pagesize,data={}){
            return{
                method:"post",
                url:"/good/getPage",
                hasToken:false,
                params:{
                    pagenum,
                    pagesize
                },
                data
            }
        }
    },
    category:{
        getTree(){
            return {
                method:"get",
                url:"/category/getTree",
                hasToken:false
            }
        }
    },
    //商品管理
    //地址管理
}