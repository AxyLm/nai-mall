var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var memberServ = authorization.getService("MemberService");

/**
 * 【增】单个添加会员
 * this.$http.post('member/insert',{
 *     telephone: "", password: "", nick_name: "",
 *     real_name: "", email: "", avatar: "", 
 * 	   deleted: 0 | 1
 * })
 */
router.post("/insert", function (req, res, next) {
	memberServ.createMember({
		"telephone": req.body.telephone,
		"password": req.body.password,
		"nick_name": req.body.nick_name,
		"real_name": req.body.real_name || null,
		"email": req.body.email || null,
		"avatar": req.body.avatar || null,
		"deleted": 0
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('member/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	memberServ.deleteMember(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'member/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	memberServ.deleteMember(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑会员
 * this.$http.put('member/update/' + item.id,{
 *     telephone: "", password: "", nick_name: "",
 *     real_name: "", email: "", avatar: "",
 * })
 */
router.put("/update/:id", function (req, res, next) {
	memberServ.updateMember(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改会员删除状态
 * this.$http.put('member/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	memberServ.updateMebDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'member/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *          deleted: 0,
 *          search_input: '15225420961',
 *          order: '-sort',
 *          add_time: [开始时间，结束时间],
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": { },
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	}
	if (req.body.deleted) {
		conditions.where.deleted = req.body.deleted;
	}
	if (req.body.search_input) {
		conditions.where.$or = [
			{
				id:{
					$eq: req.body.search_input
				}
			},
			{
				telephone:{
					$eq: req.body.search_input
				}
			},
		];
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	if (req.body.add_time && Array.isArray(req.body.add_time)) {
		let dateRange = req.body.add_time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions.where.add_time = {
			$between: dateRange
		}
	}
	memberServ.getAllMembers(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('member/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	memberServ.getMemberById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;