import Vue from "vue";

export default{
    checkTel(val){
        let test = /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
        if(val.length){
          if(test){
            return true
          }else{
            Vue.prototype.$toast.fail("电话格式错误！")
            return false
          }
        }else{
          return true
        }
      },
      checkEail(val) {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (val == '' || val == null) {
            return true;
        }
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
}