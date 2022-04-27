import utils from "../utils";
export default {
    install(Vue) {
        //年月日格式化
        Vue.filter('ymd', function (value) {
            if (utils.isEmpty(value)) return "-";
            if (!(value instanceof Date)) {
                value = new Date(value*1000);
            }
            return utils.formatDate(value, "yyyy-MM-dd");
        });

        //年月日时分格式化
        Vue.filter('ymdhm', function (value) {
            if (utils.isEmpty(value)) return "-";
            if (!(value instanceof Date)) {
                value = new Date(value*1000);
            }
            return utils.formatDate(value, "yyyy-MM-dd hh:mm");
        });

        //取枚举文本
        Vue.filter('enums', function (value, enums) {
            if (utils.isEmpty(value)) return "-";
            return enums.Get(Number(value)).text;
        });

        //取枚举颜色
        Vue.filter('enumsColor', function (value, enums) {
            return enums.Get(Number(value)).color;
        });
    }
}