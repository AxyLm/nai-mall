var express = require('express');
var router = express.Router();
var path = require("path");
var banServ = require(path.join(process.cwd(), "/services/BannerService"));

/** 
 * 【查】根据条件查询
 * this.$http.get('banner/getList')
 */
router.get("/getList", function (req, res, next) {
	banServ.getBannerListByCondition({
		deleted:1
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;