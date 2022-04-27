var express = require('express');
var router = express.Router();
var path = require("path");
var goodServ = require(path.join(process.cwd(), "/services/GoodService"));

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'good/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			name:this.filterData.name,
 *          order:"-id"
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": {
			name: {
				$like: "%" + (req.body.name || "") + "%"
			},
			deleted:1,
			state:2
		},
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	};
	if (req.body.is_recomend) {
		conditions.where.is_recomend = req.body.is_recomend
	}
	if (req.body.cat_one_id) {
		conditions.where.cat_one_id = req.body.cat_one_id
	}
	if (req.body.cat_two_id) {
		conditions.where.cat_two_id = req.body.cat_two_id
	}
	if (req.body.cat_three_id) {
		conditions.where.cat_three_id = req.body.cat_three_id
	}
	conditions.order = req.body.order;
	goodServ.getAllGoods(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('good/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	goodServ.getGoodById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;