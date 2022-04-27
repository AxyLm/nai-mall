var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));

/**
 * 获取所有管理员
 * @param  {[type]}   rid                    角色id
 * @param  {[type]}   keyRolePermissions     角色拥有的权限列表
 * {101': true,'102': true,'103': true,'104': true,'105': true,}
 * @param  {Function} cb                   回调函数
 */
function authFn(rid, keyRolePermissions, cb) {
	dao.list("PermissionModel",null,function (err, permissions) {
		if (err) return cb({
			msg: "当前用户左侧菜单：权限数据查询失败！",
			code: 500,
			stack: err
		});
		var rootPermissionsResult = {};
		// 处理一级菜单
		// 如果rid为0（超管），则追加全部一级菜单
		// 如果rid非0（普管），则根据keyRolePermissions追加一级菜单
		for (idx in permissions) {
			permission = permissions[idx];
			if (permission.level == 0) {
				if (rid != 0) {
					if (!keyRolePermissions[permission.ps_id]) continue;
				}
				rootPermissionsResult[permission.ps_id] = {
					"id": permission.ps_id,
					"name": permission.name,
					"path": permission.api_path,
					"children": [],
					"order": permission.api_order,
					"icon": permission.icon,
				};
			}
		}
		// 处理二级菜单
		// 从rootPermissionsResult中找到所属一级菜单，追加到其chindren中
		for (idx in permissions) {
			permission = permissions[idx];
			if (permission.level == 1) {
				if (rid != 0) {
					if (!keyRolePermissions[permission.ps_id]) continue;;
				}
				parentPermissionResult = rootPermissionsResult[permission.pid];
				if (parentPermissionResult) {
					parentPermissionResult.children.push({
						"id": permission.ps_id,
						"name": permission.name,
						"path": permission.api_path,
						"children": [],
						"order": permission.api_order
					});
				}
			}
		}
		// 排序
		result = _.values(rootPermissionsResult);
		result = _.sortBy(result, "order");
		for (idx in result) {
			var subresult = result[idx];
			subresult.children = _.sortBy(subresult.children, "order");
		}
		cb(null,{
			msg: "当前用户左侧菜单：获取成功！",
			code: 200,
			data: result
		});
	});
}
/**
 * 获取左侧菜单数据
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.getLeftMenus = function (userInfo, cb) {
	var rid = userInfo.rid;
	if (rid == 0) {
		authFn(rid, null, cb);
	} else {
		dao.findByID("RoleModel", userInfo.rid, function (err, role) {
			if (err) return cb({
				msg: "当前用户左侧菜单：角色查询失败！",
				code: 500,
				stack: err
			});
			if (!role) return cb({
				msg: "当前用户左侧菜单：不存在的角色！",
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