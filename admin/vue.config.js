module.exports = {
    lintOnSave: false,
    configureWebpack:{
        resolve:{
            alias:{
                "assets":"@/assets",
                "cmps":"@/components",
                "views":"@/views",
            }
        }
    },
    devServer: {
        open: false,
        host: "",
        port: process.env.port,
        https: false,
    },
}