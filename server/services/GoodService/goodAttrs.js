var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var goodAttributeDao = require(path.join(process.cwd(), "dao/GoodAttributeDAO"));
/**
 * 创建商品属性
 * 
 * @param  {[type]} goodAttribute 属性对象
 * @return {[type]}               [description]
 */
function createGoodAttribute(goodAttribute) {
    return new Promise(function (resolve, reject) {
        if (!goodAttribute) return reject({
            msg: "商品管理：商品参数对象不存在！",
            code: 400,
            stack: null
        });
        dao.create("GoodAttrModel", goodAttribute, function (err, newAttr) {
            if (err) return reject({
                msg: "商品管理：商品参数保存到数据库失败！",
                code: 500,
                stack: err
            });
            resolve(newAttr);
        });
    });
}

/**
 * 更新商品属性
 * 
 * @param  {[type]} info 参数
 * @param  {[type]} good 商品对象
 */
module.exports.doUpdateGoodAttributes = function (info) {
    return new Promise(function (resolve, reject) {
        var good = info.good;
        if (!good.id) return reject({
            msg: "商品管理：更新商品参数失败，商品id不存在！",
            code: 400,
            stack: null
        });
        if (!info.attrs) return resolve(info);
        goodAttributeDao.clearGoodAttributes(good.id, function (err) {
            if (err) return reject({
                msg: "商品管理：清理原始商品参数失败！",
                code: 500,
                stack: err
            });
            var newAttrs = info.attrs ? info.attrs : [];
            if (newAttrs) {
                var createFns = [];
                _(newAttrs).forEach(function (newattr) {
                    if (newattr.value) {
                        if (newattr.value instanceof Array) {
                            newattr.value = newattr.value.join(",");
                        } else {
                            newattr.value = newattr.value;
                        }
                    } else {
                        newattr.value = "";
                    }
                    createFns.push(createGoodAttribute({
                        attr_id: newattr.id,
                        value: newattr.value,
                        good_id: good.id
                    }));
                });
            }
            if (createFns.length == 0) return resolve(info);
            Promise.all(createFns).then(function () {
                resolve(info);
            }).catch(function (err) {
                if (err) return reject(err);
            });
        });
    });
}

/**
 * 挂载属性
 * @param  {[type]} info [description]
 * @return {[type]}      [description]
 */
module.exports.doGetAllAttrs = function (info) {
    return new Promise(function (resolve, reject) {
        var good = info.good;
        if (!good.id) return reject({
            msg: "商品管理：获取商品参数失败，商品id不存在！",
            code: 400,
            stack: null
        });
        goodAttributeDao.list(good.id, function (err, goodAttrs) {
            if (err) return reject({
                msg: "商品管理：获取商品参数失败！",
                code: 500,
                stack: err
            });
            info.good.attrs = goodAttrs;
            resolve(info);
        });
    });
}