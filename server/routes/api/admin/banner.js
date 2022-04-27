var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var banServ = authorization.getService("BannerService");

/**
 * 【增】单个添加轮播图
 * this.$http.post('banner/insert',{
 *     img_url: "", target: "", sort: "",
 *     desc: "", deleted: 0 | 1
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	banServ.createBanner({
		"img_url": req.body.img_url,
		"target": req.body.target,
		"sort": req.body.sort || 0,
		"desc": req.body.desc,
		"deleted": req.body.deleted || 0
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('banner/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	banServ.deleteBanner(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'banner/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	banServ.deleteBanner(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑轮播图
 * this.$http.put('banner/update/' + item.id,{
 *     img_url: "", target: "", sort: "",
 *     desc: "", deleted: 0 | 1
 * })
 */
router.put("/update/:id", function (req, res, next) {
	banServ.updateBanner(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改轮播图删除状态
 * this.$http.put('banner/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	banServ.updateBannerDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'banner/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			id:this.filterData.id,
 *          deleted: 0,
 *          order: '-sort',
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": {
			id:{
				$like: "%" + (req.body.id || "") + "%"
			}
		},
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
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
		}
	}
	banServ.getAllBanners(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('banner/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	banServ.getBannerById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;