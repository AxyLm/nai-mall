var path = require("path");
var roleService = require(path.join(process.cwd(), "services/RoleService"));
global.service_caches = {};
global.omit_list = null;
/**
 * 构造回调对象格式
 * 
 * @param {[type]} serviceName   服务名称
 * @param {[type]} actionName    动作名称（方法名）
 * @param {[type]} serviceModule 服务模块
 * @param {[type]} origFunc      原始方法
 */
function Invocation(serviceName, actionName, serviceModule, origFunc) {
    return function() {
        var origArguments = arguments;
        return function(req, res, next) {
            // 白名单中的接口，直接调用
            if (omit_list[serviceName] && omit_list[serviceName][actionName]) {
                origFunc.apply(serviceModule, origArguments);
                return false;
            }
            // 非白名单中的接口，进行验证权限
            // 根据serviceName、actionName从permission取出对应的ps_id
            // 根据rid，从role表中取出当前登陆用户所有的ps_ids
            // 比对通过，则调用被劫持的service action
            roleService.authRight(req.userInfo, serviceName, actionName, function(err, pass) {
                if (pass) {
                    origFunc.apply(serviceModule, origArguments);
                } else {
                    res.sendResult(null, err.code, err.msg, err.stack);
                }
            });
        }
    }
}

// 获取服务对象
module.exports.getService = function(serviceName) {
    if (global.service_caches[serviceName]) {
        return global.service_caches[serviceName];
    }
    var servicePath = path.join(process.cwd(), "services", serviceName);
    var serviceModule = require(servicePath);
    if (!serviceModule) {
        console.log("模块没有被发现");
        return null;
    }
    global.service_caches[serviceName] = {};
    console.log("*****************************************");
    console.log("拦截服务 => %s", serviceName);
    console.log("*****************************************");
    for (actionName in serviceModule) {
        if (serviceModule && serviceModule[actionName] && typeof(serviceModule[actionName]) == "function") {
            var origFunc = serviceModule[actionName];
            global.service_caches[serviceName][actionName] = Invocation(serviceName, actionName, serviceModule, origFunc);
            console.log("action => %s", actionName);
        }
    }
    console.log("*****************************************\n");
    return global.service_caches[serviceName];
}

// 设置全局验证函数
module.exports.setOmit = function(omit) {
    global.omit_list = omit;
}