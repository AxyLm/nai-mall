var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var catServ = authorization.getService("CategoryService");

/**
 * 【增】单个添加分类
 * this.$http.post('category/insert',{
 *     name: "test",
 *     pid: 0,
 *     level: 0 | 1 | 2,
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	catServ.createCategory({
		"pid": req.body.pid,
		"name": req.body.name,
		"level": req.body.level
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('category/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	catServ.deleteCategory(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'category/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	catServ.deleteCategory(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑分类名称
 * this.$http.put('category/update/' + item.id,{
 *     name:"test"
 * })
 */
router.put("/update/:id", function (req, res, next) {
	catServ.updateCategory(req.params.id, req.body.name, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改分类删除状态
 * this.$http.put('category/updateDeleted/23',{
 *     deleted:true
 * })
 */
 router.put("/updateDeleted/:id", function (req, res, next) {
	var deleted = 0;
	if (req.body.deleted && String(req.body.deleted) == "true") deleted = 1;
	catServ.updateCategoryDeleted(req.params.id, deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】树状查询
 * pagenum 或 pagesize 不存在则获取所有树状分类
 * deleted 不为布尔值，获取所有状态
 * type 不存在或为3，获取所有层级
 * this.$http({
 *		url:'category/getTreeOrList', 
 *		method:'post',
 *		params: { pagenum:1, pagesize:10 },
 *		data:{
 *			deleted:null/true/false,
 *			type:1/2/3
 *		}
 * })
 */
router.post("/getTreeOrList", function (req, res, next) {
	var conditions = {
		where:{
			name: {
				$like: "%" + (req.body.name || "") + "%"
			}
		}
	};
	if (typeof req.body.deleted == "number" || Array.isArray(req.body.deleted)) {
		conditions.where.deleted = req.body.deleted;
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	if (req.query.pagenum && req.query.pagesize) {
		conditions.pagenum = req.query.pagenum;
		conditions.pagesize = req.query.pagesize;
	}
	catServ.getAllCategories(req.body.type, conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('category/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	catServ.getCategoryById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;