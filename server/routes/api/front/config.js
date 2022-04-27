var express = require('express');
var router = express.Router();
var path = require("path");
var confServ = require(path.join(process.cwd(), "/services/ConfigService/index.js"));

/** 
 * 【查】根据 ID 查询
 * this.$http.get('config/getAll')
 */
router.get("/getAll", function (req, res, next) {
	confServ.getConfigById(1, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;