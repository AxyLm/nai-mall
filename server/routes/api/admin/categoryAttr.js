var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var attrServ = authorization.getService("CategoryAttrService");

/**
 * 【增】单个添加参数
 * this.$http.post('attributes/insert',{
 *     name: "test",
 *     catID: 1,
 *     type: static | dynamic,
 *     vals: "空格分隔的值的列表"
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	attrServ.createAttribute(req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('attributes/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	attrServ.deleteAttribute(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑参数名称和值
 * this.$http.put('attributes/update/2',{
 *     name:"test",
 *     vals: "空格分隔的值的列表"
 * })
 */
router.put("/update/:id", function (req, res, next) {
	var data = { };
	if (req.body.name) {
		data["name"] = req.body.name;
	}
	data["vals"] = req.body.vals;
	attrServ.updateAttribute(req.params.id, data, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】参数列表
 * this.$http({
 *		url:'attributes/getAll', 
 *		method:'get',
 *		params: { catID:1, type: "static" | "dynamic" },
 * })
 */
router.get("/getAll", function (req, res, next) {
	var conditions = {
		"where": {
			"cat_id": req.query.catID,
			"type": req.query.type
		},
	}
	attrServ.getAttributes(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http({
 *		url:'attributes/getByID/12', 
 *		method:'get',
 * })
 */
router.get("/getByID/:id", function (req, res, next) {
	attrServ.getAttributeById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;