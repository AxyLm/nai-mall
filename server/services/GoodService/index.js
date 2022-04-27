var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var upload_config = require('config').get("upload_config");
var formatData = require("./formatData.js");
var { generateGoodInfo, checkGoodName, createGoodInfo, updateGoodInfo, getGoodInfo } = require("./goodInfo.js");
var { doUpdateGoodAttributes, doGetAllAttrs } = require("./goodAttrs.js");
var { doUpdateGoodPics, removeGoodPicFile, doGetAllPics } = require("./goodPics.js");

/**
 * 创建商品
 * 
 * @param  {[type]}   params 商品参数
 * @param  {Function} cb     回调函数
 */
module.exports.createGood = function (params, cb) {
    // 验证参数 & 生成数据
    generateGoodInfo(params)
        // 检查商品名称
        .then(checkGoodName)
        // 创建商品
        .then(createGoodInfo)
        // 更新商品图片
        .then(doUpdateGoodPics)
        // 更新商品参数
        .then(doUpdateGoodAttributes)
        // 获取商品图片
        .then(doGetAllPics)
        // 获取商品参数
        .then(doGetAllAttrs)
        // 创建成功
        .then(function (info) {
            cb(null, {
                msg: "商品管理：创建成功！",
                code: 201,
                data: formatData(info.good)
            });
        })
        .catch(cb);
}

/**
 * 删除商品
 * 
 * @param  {[type]}   id 商品ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteGood = function (id, cb) {
    if (!id) return cb({
        msg: "商品删除失败：ID不能为空！",
        code: 400,
        stack: null
    });
    if (!Array.isArray(id)) id = [id];
    if (id.every(item => isNaN(parseInt(item)))) return cb({
        msg: "商品删除失败：ID必须是数字！",
        code: 400,
        stack: null
    });
    dao.list("GoodPicModel", { where: { good_id: id } }, function (err, goodpics) {
        if (err) return cb({
            msg: "：商品删除失败，查询商品图片出错！",
            code: 500,
            stack: err
        });
        goodpics = goodpics || [];
        var batchFns = [];
        goodpics.map(function (it) {
            batchFns.push(removeGoodPicFile(
                path.join(process.cwd(), it.big)
            ));
            batchFns.push(removeGoodPicFile(
                path.join(process.cwd(), it.mid)
            ));
            batchFns.push(removeGoodPicFile(
                path.join(process.cwd(), it.sma)
            ));
        });
        Promise.all(batchFns).then(function () {
            dao.destroyMany("GoodModel", id, function (err) {
                if (err) return cb({
                    msg: "商品删除失败： 删除出错！",
                    code: 500,
                    stack: err
                });
                cb(null, {
                    msg: "商品删除成功！",
                    code: 200,
                    data: null
                });
            });
        }).catch(cb);
    });
}

/**
 * 更新商品
 * 
 * @param  {[type]}   id     商品ID
 * @param  {[type]}   params 参数
 * @param  {Function} cb     回调函数
 */
module.exports.updateGood = function (id, params, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "商品更新失败：ID不合法！",
        code: 400,
        stack: null
    });
    params.id = id;
    // 验证参数 & 生成数据
    generateGoodInfo(params)
        // 检查商品名称
        .then(checkGoodName)
        // 创建商品
        .then(updateGoodInfo)
        // 更新商品图片
        .then(doUpdateGoodPics)
        // 更新商品参数
        .then(doUpdateGoodAttributes)
        .then(doGetAllPics)
        .then(doGetAllAttrs)
        // 创建成功
        .then(function (info) {
            cb(null, {
                msg: "商品管理：更新成功！",
                code: 200,
                data: formatData(info.good)
            });
        }).catch(cb);
}

/**
 * 修改商品删除状态
 * 
 * @param  {[type]}   id        商品ID
 * @param  {[type]}   deleted   删除状态
 * @param  {Function} cb        回调函数
 */
module.exports.updateGoodDeleted = function (id, deleted, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "商品上下架：ID不合法！",
        code: 400,
        stack: null
    });
    dao.findByID("GoodModel", id, function (err, good) {
        if (err) return cb({
            msg: "商品上下架：商品获取失败！",
            code: 500,
            stack: err
        });
        if (!good) return cb({
            msg: "商品上下架：商品不存在！",
            code: 403,
            stack: null
        });
        dao.update("GoodModel", id, {
            "deleted": deleted,
            'delete_time': Date.parse(new Date()) / 1000,
            'upd_time': Date.parse(new Date()) / 1000
        }, function (err, newGood) {
            if (err) return cb({
                msg: "商品上下架：切换删除状态失败！",
                code: 500,
                stack: err
            });
            cb(null, {
                msg: "商品上下架：切换删除状态成功！",
                code: 200,
                data: formatData(newGood)
            });
        });
    });
}

/**
 * 修改商品推荐状态
 * 
 * @param  {[type]}   id            商品ID
 * @param  {[type]}   is_recomend   推荐状态
 * @param  {Function} cb            回调函数
 */
module.exports.updateGoodRecomend = function (id, is_recomend, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "商品推荐：ID不合法！",
        code: 400,
        stack: null
    });
    dao.findByID("GoodModel", id, function (err, good) {
        if (err) return cb({
            msg: "商品推荐：商品获取失败！",
            code: 500,
            stack: err
        });
        if (!good) return cb({
            msg: "商品推荐：商品不存在！",
            code: 403,
            stack: null
        });
        dao.update("GoodModel", id, {
            "is_recomend": is_recomend,
            'upd_time': Date.parse(new Date()) / 1000
        }, function (err, newGood) {
            if (err) return cb({
                msg: "商品推荐：设置失败！",
                code: 500,
                stack: err
            });
            cb(null, {
                msg: "商品推荐：设置成功！",
                code: 200,
                data: formatData(newGood)
            });
        });
    });
}

/**
 * 修改商品提交状态
 * 
 * @param  {[type]}   id      商品ID
 * @param  {Function} cb      回调函数
 */
module.exports.submitGood = function (id, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "提交失败：ID不合法！",
        code: 400,
        stack: null
    });
    getGoodInfo({ "id": id, "state": 1 })
        .then(function (info) {
            if ([1, 2].includes(info.good.state)) {
                return Promise.reject({
                    msg: "提交失败：状态值错误！",
                    code: 400,
                    stack: null
                });
            } else {
                return Promise.resolve(info);
            }
        })
        .then(updateGoodInfo)
        .then(function (info) {
            cb(null, {
                msg: "提交成功！",
                code: 200,
                data: formatData(info.good)
            });
        })
        .catch(cb);
}

/**
 * 修改商品审核状态
 * 
 * @param  {[type]}   id      商品ID
 * @param  {[type]}   state   商品状态
 * @param  {Function} cb      回调函数
 */
module.exports.auditGood = function (id, state, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "审核失败：ID不合法！",
        code: 400,
        stack: null
    });
    if (state != 2 && state != 3) return cb({
        msg: "审核失败：状态值错误！",
        code: 400,
        stack: null
    });
    getGoodInfo({ "id": id, "state": state })
        .then(function (info) {
            if ([0, 2, 3].includes(info.good.state)) {
                return Promise.reject({
                    msg: "审核失败：状态值错误！",
                    code: 400,
                    stack: null
                });
            } else {
                return Promise.resolve(info);
            }
        })
        .then(updateGoodInfo)
        .then(function (info) {
            cb(null, {
                msg: "审核成功！",
                code: 200,
                data: formatData(info.good)
            });
        })
        .catch(cb);
}

/**
 * 获取商品列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.getAllGoods = function (conditions, cb) {
    if (!conditions.pagenum || conditions.pagenum <= 0) return cb({
        msg: "pagenum 参数不合法！",
        code: 400,
        stack: null
    });
    if (!conditions.pagesize || conditions.pagesize <= 0) return cb({
        msg: "pagesize 参数不合法！",
        code: 400,
        stack: null
    });
    dao.countByConditions("GoodModel", conditions, function (err, count) {
        if (err) return cb({
            msg: "商品列表：获取总数失败！",
            code: 500,
            stack: err
        });
        // 构建分页条件
        pagenum = parseInt(conditions["pagenum"]);
        pagesize = parseInt(conditions["pagesize"]);
        pageCount = Math.ceil(count / pagesize);
        offset = (pagenum - 1) * pagesize;
        if (offset >= count) {
            offset = count;
        }
        limit = pagesize;
        conditions["offset"] = offset;
        conditions["limit"] = limit;
        // 构建子查询条件
        // 统计每个商品的销量
        conditions["attributes"] = {
            include: [
                [
                    global.database.sequelize.literal(`(
                        SELECT AVG((comment.overall_rating+comment.good_rating+comment.delivery_rating+comment.service_rating)/4)
                        FROM comment
                        WHERE comment.good_id = GoodModel.id
                    )`),
                    'score'
                ],
                [
                    global.database.sequelize.literal(`(
                        SELECT SUM(order_good.good_count)
                        FROM order_good
                        WHERE order_good.good_id = GoodModel.id
                    )`),
                    'sales'
                ],
                [
                    global.database.sequelize.literal(`(
                        SELECT group_concat(good_pic.big)
                        FROM good_pic
                        WHERE good_pic.good_id = GoodModel.id
                    )`),
                    'pics'
                ],
            ]
        }
        // 构建筛选条件
        if (conditions["order"]) {
            if (!Array.isArray(conditions["order"])) conditions["order"] = [conditions["order"]];
            conditions["order"] = conditions["order"].map(od => {
                var isOrderBySub = od.search(/sales|score/) >= 0;
                return isOrderBySub ? { sub: od } : od;
            });
        } else {
            conditions["order"] = "-id";
        }
        dao.list("GoodModel", conditions, async function (err, good) {
            if (err) return cb({
                msg: "商品列表：获取分页数据失败！",
                code: 500,
                stack: err
            });
            for (idx in good) {
                var pics = good[idx].dataValues.pics;
                pics = pics ? pics.split(",") : [];
                pics = pics.map(function (pic) {
                    return pic.indexOf("http") == 0 ? pic : upload_config.get("baseURL") + pic;
                });
                good[idx].pics = pics;
                good[idx].sales = good[idx].dataValues.sales;
                good[idx].score = good[idx].dataValues.score;
            }
            var resultDta = {};
            resultDta["total"] = count;
            resultDta["pagenum"] = pagenum;
            resultDta["good"] = good.map(formatData);
            cb(null, {
                msg: "商品列表：获取分页数据成功！",
                code: 200,
                data: resultDta
            });
        })
    });
}

/**
 * 通过商品ID获取商品数据
 * 
 * @param  {[type]}   id 商品ID
 * @param  {Function} cb 回调函数
 */
module.exports.getGoodById = function (id, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
        msg: "获取商品数据失败：商品ID不合法！",
        code: 400,
        stack: null
    });
    getGoodInfo({ "id": id })
        .then(doGetAllPics)
        .then(doGetAllAttrs)
        .then(function (info) {
            cb(null, {
                msg: "获取商品数据成功！",
                code: 200,
                data: formatData(info.good)
            });
        }).catch(cb);
}