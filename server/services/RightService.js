var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));

function authFn(rid, keyRolePermissions, cb) {
	dao.list("PermissionModel",null,function (err, permissions) {
		if (err) return cb({
			msg: "当前用户权限列表：权限数据查询失败！",
			code: 500,
			stack: err
		});
		var rootPermissionsResult = {};
		// 处理一级菜单
		for (var idx in permissions) {
			var permission = permissions[idx];
			if (permission && permission.level == 0) {
				if (rid != 0) {
					if (!keyRolePermissions[permission.ps_id]) continue;
				}
				rootPermissionsResult[permission.ps_id] = { };
			}
		}
		// 处理二级菜单
		var tmpResult = {};
		for (var idx in permissions) {
			var permission = permissions[idx];
			if (permission && permission.level == 1) {
				if (rid != 0) {
					if (!keyRolePermissions[permission.ps_id]) continue;;
				}
				var parentPermissionResult = rootPermissionsResult[permission.pid];
				if (parentPermissionResult) {
					tmpResult[permission.ps_id] = { }
					parentPermissionResult[permission.alias] = tmpResult[permission.ps_id];
				}
			}
		}
		// 处理三级菜单
		for (var idx in permissions) {
			var permission = permissions[idx];
			if (permission && permission.level == 2) {
				if (rid != 0) {
					if (!keyRolePermissions[permission.ps_id]) continue;;
				}
				var parentPermissionResult = tmpResult[permission.pid];
				if (parentPermissionResult) {
					parentPermissionResult[permission.alias] = true;
				}
			}
		}
		// 一级菜单ps_id转alias
		var result = {};
		for(var idx in rootPermissionsResult){
			var psidKey = idx;
			var val = rootPermissionsResult[psidKey];
			var aliasKey = permissions.find(item=>item.ps_id == psidKey).alias;
			result[aliasKey] = val;
		}
		cb(null,{
			msg: "当前用户权限列表：获取成功！",
			code: 200,
			data: result
		});
	});
}

// 获取所有权限
module.exports.getAllRights = function (type, cb) {
	if (!type || (type != "list" && type != "tree")) {
		return cb({
			msg: "所有权限列表：显示类型参数错误！",
			code: 400,
			stack: null
		});
	}
	dao.list("PermissionModel",null,function (err, permissions) {
		if (err) return cb({
			msg: "所有权限列表：获取失败！",
			code: 500,
			stack: err
		});
		if (type == "list") {
			var result = [];
			for (idx in permissions) {
				permission = permissions[idx];
				result.push({
					"id": permission.ps_id,
					"name": permission.name,
					"level": permission.evel,
					"pid": permission.pid,
					"path": permission.api_path
				});
			}
			cb(null,{
				msg: "所有权限列表：获取成功！",
				code: 200,
				data: result
			});
		} else {
			var keyCategories = _.keyBy(permissions, 'ps_id');
			// 显示一级
			var permissionsResult = {};
			// 处理一级菜单
			for (idx in permissions) {
				permission = permissions[idx];
				if (permission && permission.level == 0) {
					permissionsResult[permission.ps_id] = {
						"id": permission.ps_id,
						"name": permission.name,
						"path": permission.api_path,
						"pid": permission.pid,
						"level": permission.level,
						"children": []
					};
				}
			}
			// 临时存储二级返回结果
			tmpResult = {};
			// 处理二级菜单
			for (idx in permissions) {
				permission = permissions[idx];
				if (permission && permission.level == 1) {
					parentPermissionResult = permissionsResult[permission.pid];
					if (parentPermissionResult) {
						tmpResult[permission.ps_id] = {
							"id": permission.ps_id,
							"name": permission.name,
							"path": permission.api_path,
							"pid": permission.pid,
							"level": permission.level,
							"children": []
						}
						parentPermissionResult.children.push(tmpResult[permission.ps_id]);
					}
				}
			}
			// 处理三级菜单
			for (idx in permissions) {
				permission = permissions[idx];
				if (permission && permission.level == 2) {
					parentPermissionResult = tmpResult[permission.pid];
					if (parentPermissionResult) {
						parentPermissionResult.children.push({
							"id": permission.ps_id,
							"name": permission.name,
							"path": permission.api_path,
							"pid": permission.pid + "," + keyCategories[permission.pid].pid
						});
					}
				}
			}
			cb(null,{
				msg: "所有权限列表：获取成功！",
				code: 200,
				data: _.values(permissionsResult)
			});
		}
	});
}

// 获取当前用户权限
module.exports.getMyRights = function (userInfo, cb) {
	var rid = userInfo.rid;
	if (rid == 0) {
		authFn(rid, null, cb);
	} else {
		dao.findByID("RoleModel", rid, function (err, role) {
			if (err) return cb({
				msg: "当前用户权限列表：角色查询失败！",
				code: 500,
				stack: err
			});
			if (!role) return cb({
				msg: "当前用户权限列表：不存在的角色！",
				code: 500,
				stack: err
			});
			var rolePermissions = role.ps_ids.split(",");
			var keyRolePermissions = {};
			for (idx in rolePermissions) {
				keyRolePermissions[rolePermissions[idx]] = true;
			}
			authFn(rid, keyRolePermissions, cb);
		});
	}
}