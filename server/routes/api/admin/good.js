var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
// 通过验证模块获取分类管理
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var goodServ = authorization.getService("GoodService");

/** 
 * 【增】单个添加商品
 * this.$http.post('good/insert',{
	"name":"手机333", "price":"12", "weight":"12", "number":"12", "cat":"174,178,187",
	"attrs":[
		{ "id":1072, "value":"【预售】尊享版,【预售】标配版,【预售】高配版,尊享版,标配版,高配版,海鸥灰,珠光白,魅海蓝" },
		{ "id":1059, "value":"" },
		{ "id":1060, "value":"蓝色" },
	],
	"pics":[ { "pic":"tmp_uploads\\a2cead1597255892159d383052baaa64.gif" } ],
	"introduce":"<p>是</p>",
	"is_promote": true, promote_price:10.20
 * });
 */
router.post("/insert", function (req, res, next) {
	var params = req.body;
	goodServ.createGood(params, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('good/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	goodServ.deleteGood(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'good/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	goodServ.deleteGood(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑商品信息
 * this.$http.put('good/update/' + item.id,{
 *     ......
 * })
 */
router.put("/update/:id", function (req, res, next) {
	var data = req.body;
	goodServ.updateGood(req.params.id, data, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改商品删除状态
 * this.$http.put('good/updateDeleted/23',{
 *     deleted:true
 * })
 */
 router.put("/updateDeleted/:id", function (req, res, next) {
	goodServ.updateGoodDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改商品推荐状态
 * this.$http.put('good/updateRecomend/23',{
 *     is_recomend:true
 * })
 */
 router.put("/updateRecomend/:id", function (req, res, next) {
	goodServ.updateGoodRecomend(req.params.id, req.body.is_recomend, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】商品提交审核
 * this.$http.put('good/submit/' + item.id)
 */
 router.put("/submit/:id", function (req, res, next) {
	goodServ.submitGood(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】商品通过或拒绝审核
 * this.$http.put('good/audit/' + item.id{
 *     state: 2 | 3
 * })
 */
 router.put("/audit/:id", function (req, res, next) {
	goodServ.auditGood(req.params.id, req.body.state, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

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
			}
		},
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	};
	if (req.body.deleted) {
		conditions.where.deleted = req.body.deleted
	}
	if (req.body.is_recomend) {
		conditions.where.is_recomend = req.body.is_recomend
	}
	if (req.body.is_promote) {
		conditions.where.is_promote = req.body.is_promote
	}
	if (req.body.state) {
		conditions.where.state = req.body.state
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
	if (req.body.add_time && Array.isArray(req.body.add_time)) {
		let dateRange = req.body.add_time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions.where.add_time = {
			$between: dateRange
		};
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	goodServ.getAllGoods(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('good/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	goodServ.getGoodById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;