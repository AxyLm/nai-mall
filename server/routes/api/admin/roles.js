var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var roleServ = authorization.getService("RoleService");

/** 
 * 【增】单个添加角色
 * this.$http.post('roles/insert',{
 *     name: "测试角色",
 *     desc: "角色描述",
 * })
 */
router.post("/insert", function (req, res, next) {
	roleServ.createRole({
		"name": req.body.name,
		"desc": req.body.desc,
		"ps_ca": req.body.permissionDesc
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});


/** 
 * 【删】单个物理删除
 * this.$http.delete('roles/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	roleServ.deleteRole(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'roles/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	roleServ.deleteRole(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑名称和描述
 * this.$http.put('roles/update/' + item.id,{
 *     name:"角色名称",
 *     desc:"角色描述"
 * })
 */
router.put("/update/:id", function (req, res, next) {
	roleServ.updateRole({
		"id": req.params.id,
		"name": req.body.name,
		"desc": req.body.desc,
		"ps_ca": req.body.permissionDesc
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】更新角色权限id列表
 * this.$http.post('roles/updateRights/' + item.id,{
 *     rights:"101,012,103,104"
 * })
 */
router.post("/updateRights/:id", function (req, res, next) {
	roleServ.updateRoleRight(req.params.id, req.body.rights, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】删除角色权限
 * this.$http.delete('roles/deleteRights/' + item.id,{
 *     rightId:"101"
 * })
 */
router.delete("/deleteRights/:id", function (req, res, next) {
	roleServ.deleteRoleRight(req.params.id, req.body.rightId, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】全部查询
 * this.$http({
 *		url:'roles/getAll', 
 *		method:'get',
 * })
 */
router.post("/getAll", function (req, res, next) {
	var conditions = {
		"where": {
			name: {
				$like: "%" + (req.body.name || "") + "%"
			},
		}
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	roleServ.getAllRoles(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('roles/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	roleServ.getRoleById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;