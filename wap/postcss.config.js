let pxtorem = require("postcss-pxtorem");
module.exports= function({file}){
    let rootValue;
    if (file && file.dirname.indexOf('vant') > -1) {
        // vant采用375的设计稿，rem基准值为37.5；
        rootValue = 37.5;
    } else {
        // 我们自己的设计稿为750，rem的基准值为75；
        // 注意要和flexible.js中的基准值对应。
        rootValue = 75;
    }
    return {
        plugins:[
            pxtorem({
                // 设置rem基准值
                rootValue:rootValue,
                // 对哪些px的值进行转换
                minPixelValue:2,
                // 对哪些属性的单位进行转换
                propList: ['*'],
            })
        ]
    }
}