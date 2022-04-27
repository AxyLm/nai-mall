var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var confServ = authorization.getService("ConfigService");

/** 
 * 【改】编辑配置
 * this.$http.put('config/update/' + item.id,{
 *     register_info: "", aftersale_info: "", 
 *     server_tel: "", aftersale_tel: ""
 * })
 */
router.put("/update/:id", function (req, res, next) {
	confServ.updateConfig(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('config/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	confServ.getConfigById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;