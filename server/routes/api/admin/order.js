var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var orderServ = authorization.getService("OrderService");

/** 
 * 【增】单个添加订单
 * this.$http.post('order/insert',{
	"user_id":1, "user_name":"zs",
	"good":[
		{ "good_id":1, "good_name":"", "good_price":12, "good_count":5, "cat_id":1, "cat_name":""},
	],
    "freight_money":10,"is_self_take":0,
    "receive_name":"", "receive_tel":"", "receive_address":"",
    "pay_type":"1", 
    "fapiao_title":"", "fapiao_company":"", "fapiao_content":"",
 * });
 */
router.post("/insert", function (req, res, next) {
	var params = req.body;
	orderServ.createOrder(params, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】更新订单信息
 * this.$http.put('order/update/' + item.id,{
 *     ......
 * })
 */
router.put("/update/:id", function (req, res, next) {
	var params = req.body;
	orderServ.updateOrder(req.params.id, params, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】更新订单价格
 * this.$http.put('order/updatePrice/' + item.id,{
 *     data:{total_money:100}
 * })
 */
 router.put("/updatePrice/:id", function (req, res, next) {
    console.log(req.body);
	orderServ.updateOrderPrice(req.params.id, req.body.total_money, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】更新订单发货信息
 * this.$http.put('order/updateDelivery/' + item.id,{
 *     data:{company:"",number:""}
 * })
 */
router.put("/updateDelivery/:id", function (req, res, next) {
	let params = {
		"company":req.body.company,
		"number":req.body.number
	}
	orderServ.updateOrderDelivery(req.params.id, params, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】更新订单关闭状态
 * this.$http.put('order/closeOrder/23')
 */
 router.put("/closeOrder/:id", function (req, res, next) {
	orderServ.closeOrder(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'order/getPage', 
 *		method:'post',
 *		params: {pagenum:1,pagesize:10},
 *		data:{
 *			user_id, status, pay_type,code,add_time:[],
 *          fapiao_title, fapiao_company, fapiao_content
 *		}
 * })
 */
 router.post("/getPage", function (req, res, next) {
	var conditions = {
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize,
		where: {}
	};
	if (req.body.user_id) {
		conditions["where"]["user_id"] = req.body.user_id;
	}
	if (req.body.status) {
		conditions["where"]["status"] = req.body.status;
	}
	if (req.body.pay_type) {
		conditions["where"]["pay_type"] = req.body.pay_type;
	}
	if (req.body.is_self_take) {
		conditions["where"]["is_self_take"] = req.body.is_self_take;
	}
    if (req.body.search_input) {
        conditions["where"]["$or"] = [
			{
				id:{
					$like: "%" + req.body.search_input + "%"
				}
			},
			{
				code:{
					$like: "%" + req.body.search_input + "%"
				}
			},
			{
				user_name:{
					$like: "%" + req.body.search_input + "%"
				}
			}
		]			
    }
	if (req.body.fapiao_title) {
		conditions["where"]["fapiao_title"] = req.body.fapiao_title;
	}
	if (req.body.fapiao_company) {
		conditions["where"]["fapiao_company"] = {
			$like: "%" + (req.body.fapiao_company || "") + "%"
		};
	}
	if (req.body.fapiao_content) {
		conditions["where"]["fapiao_content"] = {
			$like: "%" + (req.body.fapiao_content || "") + "%"
		};
	}
	if (req.body.add_time && Array.isArray(req.body.add_time)) {
		let dateRange = req.body.add_time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions["where"]["add_time"] = {
			$between: dateRange
		};
	}
	orderServ.getAllOrders(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('order/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	orderServ.getOrderById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;