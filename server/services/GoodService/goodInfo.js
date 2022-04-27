var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var upload_config = require('config').get("upload_config");

/**
 * 通过参数生成产品基本信息
 * 
 * @param  {[type]} params.cb [description]
 * @return {[type]}           [description]
 */
module.exports.generateGoodInfo = function (params) {
    return new Promise(function (resolve, reject) {
        var info = {};
        if (params.id) info["id"] = params.id;
        info["name"] = params.name;
        info["price"] = params.price;
        info["number"] = params.number;
        info["weight"] = params.weight;
        // 分类
        if (!params.cat) return reject({
            msg: "商品管理：商品没有设置所属分类！",
            code: 400,
            stack: null,
        });
        var cats = params.cat.split(',');
        info["cat_one_id"] =cats.length > 0 ?  cats[0] : null;
        info["cat_two_id"] =cats.length > 1 ?  cats[1] : null;
        info["cat_three_id"] =cats.length > 2 ?  cats[2] : null;
        info["cat_id"] = cats[cats.length - 1];
        // 详情
        info["introduce"] = params.introduce || "";
        // 图片
        info["pics"] = params.pics || [];
        // 属性
        info["attrs"] = params.attrs || [];
        // 其他
        info["big_logo"] = params.big_logo || "";
        info["small_logo"] = params.small_logo || "";
        if (!params.id) {
            info["add_time"] = Date.parse(new Date()) / 1000;
            info["deleted"] = 0;
            info["state"] = params.state || 0;
        } else {
            info["upd_time"] = Date.parse(new Date()) / 1000;
        }
        info["is_promote"] = params.is_promote;
        info["promote_price"] = params.is_promote ? params.promote_price : null;
        if (params.is_recomend !== undefined) {
            info["is_recomend"] = params.is_recomend;
        }
        resolve(info);
    });
}

/**
* 检查商品名称是否重复
* 
* @param  {[type]} info [description]
* @return {[type]}      [description]
*/
module.exports.checkGoodName = function (info) {
    return new Promise(function (resolve, reject) {
        dao.findOne("GoodModel", { "name": info.name }, function (err, good) {
            if (err) return reject({
                msg: "商品管理：检查商品名称失败！",
                code: 500,
                stack: err
            });
            if (!good) return resolve(info);
            if (good.id == info.id) return resolve(info);
            return reject({
                msg: "商品管理：商品名称已存在！",
                code: 403,
                stack: null
            });
        });
    });
}

/**
* 创建商品基本信息
* 
* @param  {[type]} info [description]
* @return {[type]}      [description]
*/
module.exports.createGoodInfo = function (info) {
    return new Promise(function (resolve, reject) {
        dao.create("GoodModel", _.clone(info), function (err, newGood) {
            if (err) return reject({
                msg: "商品管理：创建商品基本信息失败！",
                code: 500,
                stack: err
            });
            info.good = newGood;
            return resolve(info);
        });
    });
}

/**
 * 更新商品基本信息
 * 
 * @param  {[type]} info [description]
 * @return {[type]}      [description]
 */
module.exports.updateGoodInfo = function (info) {
    return new Promise(function (resolve, reject) {
        dao.update("GoodModel", info.id, _.clone(info), function (err, newGood) {
            if (err) return reject({
                msg: "商品管理：更新商品基本信息失败！",
                code: 500,
                stack: err
            });
            info.good = newGood;
            return resolve(info);
        });
    });
}

/**
 * 获取商品对象
 * 
 * @param  {[type]} info 查询内容
 * @return {[type]}      [description]
 */
module.exports.getGoodInfo = function (info) {
    return new Promise(function (resolve, reject) {
        var conditions = {};
        conditions.id = info.id;
        conditions["attributes"] = {
            include: [
                [
                    global.database.sequelize.literal(`(
                        SELECT AVG((comment.overall_rating+comment.good_rating+comment.delivery_rating+comment.service_rating)/4)
                        FROM comment
                        WHERE comment.good_id = ${info.id}
                    )`),
                    'score'
                ],
                [
                    global.database.sequelize.literal(`(
                        SELECT SUM(order_good.good_count)
                        FROM order_good
                        WHERE order_good.good_id = ${info.id}
                    )`),
                    'sales'
                ]
            ]
        }
        dao.findOne("GoodModel", conditions, function (err, good) {
            if (err) return reject({
                msg: "商品管理：获取商品数据失败！",
                code: 500,
                stack: err
            });
            var pics = good.dataValues.pics;
            pics = pics ? pics.split(",") : [];
            pics = pics.map(function (pic) {
                return pic.indexOf("http") == 0 ? pic : upload_config.get("baseURL") + pic;
            });
            good.pics = pics;
            good.sales = good.dataValues.sales;
            good.score = good.dataValues.score;
            info["good"] = good;
            return resolve(info);
        });
    });
}