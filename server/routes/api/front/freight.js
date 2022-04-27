var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var freightServ = authorization.getService("FreightService");

/**
 * 【增】单个添加运费模板
 * this.$http.post('freight/insert',{
 *     name: "", delivery_time: "", good_addr_code: "", good_addr_info: "", 
 *     is_free: 0 | 1, price_method: 0 | 1 | 2, specify_free_condition: 0 | 1, 
 * 	   deleted: 0 | 1
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	freightServ.createFreight({
		"name": req.body.name,
		"delivery_time": req.body.delivery_time,
		"good_addr_code": req.body.good_addr_code,
		"good_addr_info": req.body.good_addr_info,
		"is_free": req.body.is_free,
		"price_method": req.body.price_method,
		"specify_free_condition": req.body.specify_free_condition,
		"deleted": req.body.deleted || 0,
		"freight_delivery": req.body.freight_delivery || [],
		"freight_condition": req.body.freight_condition || [],
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('freight/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	freightServ.deleteFreight(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'freight/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	freightServ.deleteFreight(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑运费模板
 * this.$http.put('freight/update/' + item.id,{
 *     name: "", delivery_time: "", good_addr_code: "", good_addr_info: "", 
 *     is_free: 0 | 1, price_method: 0 | 1 | 2, specify_free_condition: 0 | 1, 
 * 	   deleted: true | false
 * })
 */
router.put("/update/:id", function (req, res, next) {
	req.body.freight_delivery = req.body.freight_delivery || [];
	req.body.freight_condition = req.body.freight_condition || [];
	freightServ.updateFreight(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改运费模板删除状态
 * this.$http.put('freight/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	freightServ.updateFreightDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'freight/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			id:this.filterData.id,
 *          deleted: 0,
 *          order: '-id',
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": { },
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	}
	if(req.body.search_input){
		conditions.where.$or = [
			{
				id:{
					$eq: req.body.search_input
				}
			},
			{
				name:{
					$like: "%" + req.body.search_input + "%"
				}
			}
		]
	}
	if (req.body.deleted) {
		conditions.where.deleted = req.body.deleted;
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	if (req.body.add_time && Array.isArray(req.body.add_time)) {
		let dateRange = req.body.add_time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions.where.add_time = {
			$between: dateRange
		};
	}
	freightServ.getAllFreights(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('freight/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	freightServ.getFreightById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;