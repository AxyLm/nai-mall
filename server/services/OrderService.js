var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var orderGoodDao = require(path.join(process.cwd(), "dao/OrderGoodDao"));

var uniqid = require('uniqid');
var upload_config = require('config').get("upload_config");

function formatData(order) {
	return {
		"id": order.id,
		"user_id": order.user_id,
		"user_name": order.user_name,
		"code": order.code,
		"good_count": order.good_count,
		"good_money": order.good_money,
		"freight_money": order.freight_money,
		"total_money": order.total_money,
		"receive_name": order.receive_name,
		"receive_tel": order.receive_tel,
		"receive_address": order.receive_address,
		"pay_type": order.pay_type,
		"pay_no": order.pay_no,
		"is_self_take": order.is_self_take,
		"fapiao_title": order.fapiao_title,
		"fapiao_company": order.fapiao_company,
		"fapiao_content": order.fapiao_content,
		"status": order.status,
		"add_time": order.add_time,
		"upd_time": order.upd_time,
		"good": order.good&&order.good.length ? order.good : null,
		"delivery": order.delivery || null
	}
}

function doCheckOrderParams(params) {
	return new Promise(function (resolve, reject) {
		var info = {};
		if (params.id) info.id = params.id;
		// 创建时
		if (!params.id) {
			// 用户id和名称
			if (!params.user_id || isNaN(parseInt(params.user_id))) return reject({
                msg: "创建订单：会员ID不合法！",
                code: 400,
                stack: null,
            });
			if (!params.user_name) return reject({
                msg: "创建订单：会员名称不能为空！",
                code: 400,
                stack: null,
            });
			info.user_id = params.user_id;
			info.user_name = params.user_name;
			// 订单号
			info.code = uniqid();
			// 商品列表
			if (!params.good) return reject({
                msg: "创建订单：商品不能为空！",
                code: 400,
                stack: null,
            });
			if (!Array.isArray(params.good)) return reject({
                msg: "创建订单：商品格式不是数组！",
                code: 400,
                stack: null,
            });
			if (!params.good.length) return reject({
                msg: "创建订单：商品数量不能为0！",
                code: 400,
                stack: null,
            });
			info.good = params.good;
			// 商品数量
			info.good_count = params.good.reduce((tmp, it)=>{
				tmp += it.good_count;
				return tmp;
			},0);
			// 商品金额
			info.good_money = params.good.reduce((tmp, it)=>{
				tmp += it.good_price*it.good_count;
				return tmp;
			},0);
			// 运费金额
            if (typeof params.freight_money !="number" && !params.freight_money) return reject({
                msg: "订单创建：运费金额不能为空！",
                code: 400,
                stack: null,
            });
            var freight_money = parseFloat(params.freight_money);
            if (isNaN(freight_money) || freight_money < 0) return reject({
                msg: "订单创建：运费金额不正确！",
                code: 400,
                stack: null,
            })
			info.freight_money = params.freight_money;
            // 订单总金额（商品金额+运费金额）
			info.total_money = freight_money+info.good_money;
            // 是否自提
			if (typeof params.is_self_take !="number" && !params.is_self_take) return reject({
                msg: "订单创建：邮寄方式不能为空！",
                code: 400,
                stack: null,
            });
            info.is_self_take = params.is_self_take;
            // 收货人姓名
            if (params.is_self_take==0&&!params.receive_name) return reject({
                msg: "订单创建：收货人姓名不能为空！",
                code: 400,
                stack: null,
            });
            info.receive_name = params.receive_name;
            // 收货人电话
            if (params.is_self_take==0&&!params.receive_tel) return reject({
                msg: "订单创建：收货人电话不能为空！",
                code: 400,
                stack: null,
            });
            info.receive_tel = params.receive_tel;
            // 收货人地址
            if (params.is_self_take==0&&!params.receive_address) return reject({
                msg: "订单创建：收货人地址不能为空！",
                code: 400,
                stack: null,
            });
            info.receive_address = params.receive_address;
			// 支付方式： 1 支付宝 2 微信 3 银行卡
			if (!params.pay_type) return reject({
                msg: "订单创建：支付方式不能为空！",
                code: 400,
                stack: null,
            });
            info.pay_type = params.pay_type;
			// 发票抬头
			if (params.fapiao_title) {
				if (params.fapiao_title != 0 && params.fapiao_title != 1){
					return reject({
                        msg: "订单创建：发票抬头必须是 个人 或 公司！",
                        code: 400,
                        stack: null,
                    });
                }
				info.fapiao_title = params.fapiao_title;
			} else {
				info.fapiao_title = 0;
			}
			// 发票主体
			if (params.fapiao_company) {
				info.fapiao_company = params.fapiao_company;
			} else {
				info.fapiao_company = "";
			}
			// 发票内容
			if (params.fapiao_content) {
				info.fapiao_content = params.fapiao_content;
			} else {
				info.fapiao_content = "";
			}
			// 订单状态： 0 否 1 是
			info.status = 0;
			// 创建时间
			info.add_time = (Date.parse(new Date()) / 1000)
		}else{
			// 订单支付方式
			if (params.pay_type) {
				info.pay_type = params.pay_type;
			}
			// 订单状态
			if (params.status) {
				info.status = params.status;
			}
			// 交易流水号
			if (params.pay_no) {
				info.pay_no = params.pay_no;
			}
			// 发票抬头
			if (params.fapiao_title) {
				if (params.fapiao_title != 0 && params.fapiao_title != 1){
					return reject({
                        msg: "订单创建：发票抬头必须是 个人 或 公司！",
                        code: 400,
                        stack: null,
                    });
                }
				info.fapiao_title = params.fapiao_title;
			} else {
				info.fapiao_title = 0;
			}
			// 发票主体
			if (params.fapiao_company) {
				info.fapiao_company = params.fapiao_company;
			}
			// 发票内容
			if (params.fapiao_content) {
				info.fapiao_content = params.fapiao_content;
			}
			// 收货人姓名
			if (params.receive_name) {
				info.receive_name = params.receive_name;
			}
			// 收货人电话
			if (params.receive_tel) {
				info.receive_tel = params.receive_tel;
			}
			// 收货人地址
			if (params.receive_address) {
				info.receive_address = params.receive_address;
			}
			info.upd_time = (Date.parse(new Date()) / 1000);
		}
        console.log(info);
		resolve(info);
	});
}
// 创建订单、订单商品、订单快递的方法
function doCreateOrder(info) {
	return new Promise(function (resolve, reject) {
		dao.create("OrderModel", _.clone(info), function (err, newOrder) {
			if (err) return reject({
                msg: "创建订单失败！",
                code: 500,
                stack: err
            });
			info.order = newOrder;
			resolve(info);
		});
	});
}

function doAddOrderGoods(info) {
	return new Promise(function (resolve, reject) {
		if (!info.order) return reject({
            msg: "创建订单商品：对应订单不存在！",
            code: 500,
            stack: null
        });
		var orderGood = info.good;
		var fns = [];
		_(orderGood).forEach(function (og) {
            console.log(og);
			let data = {
				"order_id": info.order.id,
				"good_id": og.good_id,
				"good_name": og.good_name,
				"good_price": og.good_price,
				"good_count": og.good_count,
				"cat_id": og.cat_id,
				"cat_name": og.cat_name
			}
			fns.push(doCreateOrderGood(data));
		});
		Promise.all(fns).then(function (results) {
			info.order.good = results;
			resolve(info);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function doCreateOrderGood(orderGood) {
	return new Promise(function (resolve, reject) {
		dao.create("OrderGoodModel", orderGood, function (err, newOrderGood) {
            if (err) return reject({
                msg: "创建订单商品失败!",
                code: 500,
                stack: err
            });
			resolve(newOrderGood);
		});
	});
}

function doCreateOrderDelivery(info) {
	return new Promise(function (resolve, reject) {
		dao.create("OrderDeliveryModel", info.delivery, function (err, newOrderDelivery) {
			if (err) return reject({
                msg: "创建订单发货信息失败!",
                code: 500,
                stack: err
            });
			resolve({
				id: info.id,
				status: info.status
			});
		});
	});
}

// 获取订单商品、订单快递信息的方法
function doGetOrder(info) {
	return new Promise(function (resolve, reject) {
		dao.findByID("OrderModel", info.id, function (err, newOrder) {
            if (err) return reject({
                msg: "获取订单失败！",
                code: 500,
                stack: err
            });
			if (!newOrder) return reject({
                msg: "订单不存在！",
                code: 400,
                stack: null
            });
			info.order = newOrder;
			resolve(info);
		});
	});
}

function doGetAllOrderGoods(info) {
	return new Promise(function (resolve, reject) {
		orderGoodDao.list(info.order.id, function (err, orderGoods) {
			if (err) return reject({
                msg: "获取订单商品失败！",
                code: 500,
                stack: err
            });
			orderGoods.forEach(it=>{
				if(it.big_imgs){
					it.big_imgs = it.big_imgs.split(",");
                    it.big_imgs = it.big_imgs.map(jt=>{
                        if (jt.indexOf("http") == -1) {
                            jt = upload_config.get("baseURL") + jt;
                        }
                        return jt;
                    });
				}
				if(it.mid_imgs){
					it.mid_imgs = it.mid_imgs.split(",");
                    it.mid_imgs = it.mid_imgs.map(jt=>{
                        if (jt.indexOf("http") == -1) {
                            jt = upload_config.get("baseURL") + jt;
                        }
                        return jt;
                    });
				}
				if(it.sma_imgs){
					it.sma_imgs = it.sma_imgs.split(",");
                    it.sma_imgs = it.sma_imgs.map(jt=>{
                        if (jt.indexOf("http") == -1) {
                            jt = upload_config.get("baseURL") + jt;
                        }
                        return jt;
                    });
				}
			});
			info.order.good = orderGoods;
			resolve(info);
		});
	});
}

function doGetOrderDelivery(info) {
	return new Promise(function (resolve, reject) {
		dao.findOne("OrderDeliveryModel", { "order_id": info.order.id }, function (err, orderDelivery) {
			if (err) return reject({
                msg: "获取订单发货信息失败！",
                code: 500,
                stack: err
            });
			info.order.delivery = orderDelivery;
			resolve(info);
		});
	});
}
// 更新订单信息的方法
function doUpdateOrder(info) {
	return new Promise(function (resolve, reject) {
		dao.update("OrderModel", info.id, _.clone(info), function (err, newOrder) {
			if (err) return reject({
                msg: "订单更新失败！",
                code: 500,
                stack: err
            });
			info.order = newOrder;
			resolve(info);
		});
	});
}

/**
 * 创建订单
 * 
 * @param  {[type]}   params 订单参数
 * @param  {Function} cb     回调函数
 */
module.exports.createOrder = function (params, cb) {
	doCheckOrderParams(params)
		.then(doCreateOrder)
		.then(doAddOrderGoods)
		.then(function (info) {
			cb(null, {
                msg: "订单创建成功！",
                code: 201,
                data: formatData(info.order)
            });
		})
		.catch(cb);
}

/**
 * 关闭订单
 * 
 * @param  {[type]}   id 订单ID
 * @param  {Function} cb 回调函数
 */
module.exports.closeOrder = function (id, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
		msg: "关闭失败：ID不合法！",
		code: 400,
		stack: null
	});
	doGetOrder({id:id,status:5})
    .then(function (info) {
        if([1,2,3,4,5].includes(info.order.status)){
            return Promise.reject({
                msg: "关闭失败：状态值错误！",
                code: 400,
                stack: null
            });
        }else{
            return Promise.resolve(info);
        }
	})
    .then(doUpdateOrder)
    .then(function (info) {
        cb(null,{
            msg: "关闭成功！",
            code: 200,
            data: formatData(info.order)
        });
    }).catch(cb);
}

/**
 * 更新订单
 * 
 * @param  {[type]}   id     订单ID
 * @param  {[type]}   params 参数
 * @param  {Function} cb     回调函数
 */
module.exports.updateOrder = function (id, params, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
		msg: "订单更新失败：ID不合法！",
		code: 400,
		stack: null
	});
	params["id"] = id;
	doCheckOrderParams(params)
		.then(doUpdateOrder)
		.then(function (info) {
			cb(null, {
                msg: "订单更新成功！",
                code: 200,
                data: formatData(info.order)
            });
		})
		.catch(cb);
}

/**
 * 订单改价
 * 
 * @param  {[type]}   id          订单ID
 * @param  {[type]}   total_money 订单金额
 * @param  {Function} cb          回调函数
 */
module.exports.updateOrderPrice = function (id, total_money, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
		msg: "订单改价失败：ID不合法！",
		code: 400,
		stack: null
	});
    if (!total_money || isNaN(parseInt(total_money)) || total_money<0) return cb({
		msg: "订单改价失败：价格不合法！",
		code: 400,
		stack: null
	});
    doGetOrder({
        id:id,
        total_money: total_money
    })
    .then(function (info) {
        if([1,2,3,4,5].includes(info.order.status)){
            return Promise.reject({
                msg: "订单改价失败：状态值错误！",
                code: 400,
                stack: null
            });
        }else{
            return Promise.resolve(info);
        }
	})
	.then(doUpdateOrder)
    .then(function (info) {
		cb(null, {
            msg: "订单改价成功！",
            code: 200,
            data: formatData(info.order)
        });
	}).catch(cb);
}

/**
 * 订单发货
 * 
 * @param  {[type]}   id          订单ID
 * @param  {[type]}   total_money 物流信息
 * @param  {Function} cb          回调函数
 */
module.exports.updateOrderDelivery = function (id, params, cb) {
    if (!id || isNaN(parseInt(id))) return cb({
		msg: "发货失败：ID不合法！",
		code: 400,
		stack: null
	});
    if (!params.company) return cb({
		msg: "发货失败：快递公司不能为空！",
		code: 400,
		stack: null
	});
    if (!params.number) return cb({
		msg: "发货失败：快递单号不能为空！",
		code: 400,
		stack: null
	});
    doGetOrder({
        id:id,
        status:2,
        delivery:{
			order_id:id,
			...params
		}
    })
    .then(function (info) {
        if([0,2,3,4,5].includes(info.order.status)){
            return Promise.reject({
                msg: "发货失败：状态值错误！",
                code: 400,
                stack: null
            });
        }else{
            return Promise.resolve(info);
        }
	})
	.then(doCreateOrderDelivery)
	.then(doUpdateOrder)
	.then(function (info) {
		cb(null, {
            msg: "订单发货成功！",
            code: 200,
            data: formatData(info.order)
        });
	}).catch(cb);
}

/**
 * 获取订单列表
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb         回调函数
 */
module.exports.getAllOrders = function (conditions, cb) {
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
	dao.countByConditions("OrderModel", conditions, function (err, count) {
		if(err) return cb({
			msg: "订单列表：获取总数失败！",
			code: 500,
			stack: err
		});
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if (offset >= count) {
			offset = count;
		}
		limit = pagesize;
		// 构建条件
		conditions["offset"] = offset;
		conditions["limit"] = limit;
		conditions["order"] = "-id";
		dao.list("OrderModel", conditions, function (err, order) {
			if(err) return cb({
				msg: "订单列表：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["order"] = order.map(formatData);
            cb(null, {
				msg: "订单列表：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		})
	});
}

/**
 * 通过订单ID获取订单数据
 * 
 * @param  {[type]}   id 订单ID
 * @param  {Function} cb 回调函数
 */
module.exports.getOrderById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取订单失败：ID不合法！",
		code: 400,
		stack: null
	});
	doGetOrder({ "id": id })
		.then(doGetAllOrderGoods)
		.then(doGetOrderDelivery)
		.then(function (info) {
            cb(null, {
                msg: "获取订单成功！",
                code: 200,
                data: formatData(info.order)
            });
		})
		.catch(cb);
}