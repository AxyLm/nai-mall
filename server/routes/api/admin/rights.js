var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var rightService = authorization.getService("RightService");

// 获取所有的权限列表
router.get("/getAll/:type", function (req, res, next) {
	rightService.getAllRights(req.params.type, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

// 获取当前用户的权限列表
router.get("/getMy", function (req, res, next) {
	rightService.getMyRights(req.userInfo, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;