var express = require('express');
var router = express.Router();
var path = require("path");
var menuService = require(path.join(process.cwd(), "/services/MenuService"));
router.get("/", function (req, res, next) {
	menuService.getLeftMenus(req.userInfo, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});
module.exports = router;