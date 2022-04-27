var express = require('express');
var router = express.Router();
var path = require("path");
var memberServ = require(path.join(process.cwd(), "/services/MemberService"));

/**
 * 【增】单个添加会员
 * this.$http.post('member/register',{
 *     telephone: "", password: "", nick_name: "",
 *     real_name: "", email: "", avatar: "", 
 * 	   deleted: 0 | 1
 * })
 */
router.post("/register", function (req, res, next) {
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
	});
});

/** 
 * 【改】编辑会员
 * this.$http.put('member/updateMe',{
 *     telephone: "", password: "", nick_name: "",
 *     real_name: "", email: "", avatar: "",
 * })
 */
router.put("/updateMe", function (req, res, next) {
	memberServ.updateMember(req.userInfo.uid, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('member/getMe')
 */
router.get("/getMe", function (req, res, next) {
	memberServ.getMemberById(req.userInfo.uid, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;