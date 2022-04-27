var express = require('express');
var router = express.Router();
var path = require("path");

// 通过验证模块获取用户管理服务
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var mgrServ = authorization.getService("ManagerService");

/** 
 * 【增】单个添加用户
 * this.$http.post('users/insert',{
 *     name: "admin",
 *     password: "123456",
 *     mobile: "15225420961",
 *     email: "1009988@qq.com",
 *     role_id: 23
 * })
 */
router.post("/insert",function (req, res, next) {
	var params = {
		"name": req.body.name,
		"password": req.body.password,
		"mobile": req.body.mobile,
		"email": req.body.email,
		"role_id": req.body.role_id
	}
	mgrServ.createManager(params, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('users/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	mgrServ.deleteManager(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'users/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
router.delete("/batchDelete", function (req, res, next) {
	mgrServ.deleteManager(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑电话和邮箱
 * this.$http.put('users/update/' + item.id,{
 *     mobile:"电话",
 *     email:"邮箱"
 * })
 */
router.put("/update/:id", function (req, res, next) {
	var data = {};
	if(req.body.mobile){
		data.mobile = req.body.mobile;
	}
	if(req.body.email){
		data.email = req.body.email;
	}
	if(req.body.pwd){
		data.pwd = req.body.pwd;
	}
	if(req.body.avatar){
		data.avatar = req.body.avatar;
	}
	mgrServ.updateManager(req.params.id, req.userInfo.uid, data, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改用户角色
 * this.$http.put('users/updateRole/23',{
 *     role_id:40
 * })
 */
router.put("/updateRole/:id", function (req, res, next) {
	mgrServ.setRole(req.params.id, req.body.role_id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改用户状态
 * this.$http.put('users/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	var deleted = 0;
	if (req.body.deleted && String(req.body.deleted) == "true") deleted = 1;
	mgrServ.updateMgrDeleted(req.params.id, deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'users/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			name:this.filterData.name
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": {
			$or:[
				{
					id:{
						$like: "%" + (req.body.search_input || "") + "%"
					}
				},
				{
					name:{
						$like: "%" + (req.body.search_input || "") + "%"
					}
				}
			]
		},
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	}
	if (req.body.time && Array.isArray(req.body.time)) {
		let dateRange = req.body.time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions.where.add_time = {
			$between: dateRange
		};
	}
	if (req.body.deleted) {
		conditions.where.deleted = req.body.deleted;
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	mgrServ.getAllManagers(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('users/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	mgrServ.getManagerById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】获取当前登录用户的信息
 * this.$http.get('users/getMe')
 */
router.get("/getMe", function (req, res, next) {
	mgrServ.getMe(req.userInfo.uid, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;