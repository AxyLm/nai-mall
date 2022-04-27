var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var confPayServ = authorization.getService("ConfigPayService");

/**
 * 【增】单个添加门店
 * this.$http.post('configPay/insert',{
 *     name: "", sort: 0, deleted: 0 | 1
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	confPayServ.createConfigPay({
		"name": req.body.name,
		"sort": req.body.sort || 0,
		"deleted": req.body.deleted || 0
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('configPay/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	confPayServ.deleteConfigPay(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'configPay/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	confPayServ.deleteConfigPay(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑门店
 * this.$http.put('configPay/update/' + item.id,{
 *     name: "", sort: 0, deleted: true | false
 * })
 */
router.put("/update/:id", function (req, res, next) {
	confPayServ.updateConfigPay(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改门店删除状态
 * this.$http.put('configPay/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	confPayServ.updateConfigPayDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'configPay/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			id:this.filterData.id,
 *          deleted: 0,
 *          order: '-add_time',
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
	confPayServ.getAllConfigPays(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('configPay/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	confPayServ.getConfigPayById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;