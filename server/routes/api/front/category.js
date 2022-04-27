var express = require('express');
var router = express.Router();
var path = require("path");
var catServ = require(path.join(process.cwd(), "/services/CategoryService"));

router.get("/getTree", function (req, res, next) {
	catServ.getCategoryListByCondition({
		deleted: 1
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;