var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(),"dao/DAO"));

function formatData(role) {
	return {
		"id": role.id,
		"name": role.name,
		"desc": role.desc,
		"ps_ids": role.ps_ids,
		"permissionDesc" : role.ps_ca
	}
}

function getPermissionsResult(permissionKeys,permissionIds) {
	var permissionsResult = {};
	// 处理一级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;
		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];
		if(permission && permission.level == 0) {
			permissionsResult[permission.ps_id] = {
				"id":permission.ps_id,
				"name":permission.name,
				"path":permission.api_path,
				"children":[]
			};
		}
	}
	// 临时存储二级返回结果
	tmpResult = {};
	// 处理二级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;
		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];
		if(permission && permission.level == 1) {
			parentPermissionResult = permissionsResult[permission.pid];
			if(parentPermissionResult) {
				tmpResult[permission.ps_id] = {
					"id":permission.ps_id,
					"name":permission.name,
					"path":permission.api_path,
					"children":[]
				}
				parentPermissionResult.children.push(tmpResult[permission.ps_id]);
			}
		}
	}
	// 处理三级菜单
	for(idx in permissionIds) {
		if(!permissionIds[idx] || permissionIds[idx] == "") continue;
		permissionId = parseInt(permissionIds[idx]);
		permission = permissionKeys[permissionId];
		if(permission && permission.level == 2) {
			parentPermissionResult = tmpResult[permission.pid];
			if(parentPermissionResult) {
				parentPermissionResult.children.push({
					"id":permission.ps_id,
					"name":permission.name,
					"path":permission.api_path
				});
			}
		}
	}
	return permissionsResult;
}

/**
 * 添加角色
 * 
 * @param  {[type]}   params [description]
 * @param  {Function} cb     [description]
 */
module.exports.createRole = function(params,cb) {
	if(!params.name) return cb({
		msg: "角色：名称不能为空！",
		code: 400,
		stack: err
	});
	if(!params.desc) params.desc = "";
	if(!params.ps_ca) params.ps_ca = "";
	if(!params.ps_ids) params.ps_ids = "";
	dao.create("RoleModel",params,function(err,role){
		if (err) return cb({
			msg: "角色：创建失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "角色：创建成功！",
			code: 201,
			data: formatData(role)
		});
	});
}

/**
 * 删除角色
 * 
 * @param  {[type]}   id 角色ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteRole = function(id,cb){
	if (!id) return cb({
		msg: "角色：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "角色：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.destroyMany("RoleModel",id, function (err) {
		if (err) return cb({
			msg: "角色： 删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "角色：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 * 更新角色信息
 * 
 * @param  {[type]}   role 角色对象
 * @param  {Function} cb   回调函数
 */
module.exports.updateRole = function(params,cb){
	if (!params.id || isNaN(parseInt(params.id))) return cb({
		msg: "角色：ID不合法！",
		code: 400,
		stack: null
	});
	var updateInfo = {};
	if(params.name) {
		updateInfo["name"] = params.name;
	}
	updateInfo["desc"] = params.desc;
	updateInfo["ps_ca"] = params.ps_ca;
	dao.update("RoleModel",params.id,updateInfo,function(err,newRole) {
		if (err) return cb({
			msg: "角色：更新失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "角色：更新成功！",
			code: 200,
			data: formatData(newRole)
		});
	});
}

/**
 * 对角色进行授权
 * 
 * @param  {[type]}   rights 以 "," 分割的权限列表
 * @param  {Function} cb     回调函数
 */
module.exports.updateRoleRight = function(rid,rights,cb) {
	if (!rid || isNaN(parseInt(rid))) return cb({
		msg: "角色：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("RoleModel",rid,{"ps_ids":rights},function(err,newRole) {
		if (err) return cb({
			msg: "角色：更新权限失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "角色：更新权限成功！",
			code: 200,
			data: formatData(newRole)
		});
	});
}

/**
 * 删除权限
 * 
 * @param  {[type]}   rid            权限ID
 * @param  {[type]}   deletedRightId 删除的权限ID
 * @param  {Function} cb             回调函数
 */
module.exports.deleteRoleRight = function(rid,deletedRightId,cb) {
	if (!rid || isNaN(parseInt(rid))) return cb({
		msg: "角色：ID不合法！",
		code: 400,
		stack: null
	});
	if (!deletedRightId || isNaN(parseInt(deletedRightId))) return cb({
		msg: "角色：权限ID不合法！",
		code: 400,
		stack: null
	});
	dao.findOne("RoleModel",{"id":rid},function(err,role){
		if (err) return cb({
			msg: "角色：获取角色失败！",
			code: 500,
			stack: err
		});
		if(!role) return cb({
			msg: "角色：该角色不存在！",
			code: 400,
			stack: err
		});
		ps_ids = role.ps_ids.split(",");
		new_ps_ids = [];
		for(idx in ps_ids) {
			ps_id = ps_ids[idx];
			if(parseInt(deletedRightId) == parseInt(ps_id)) {
				continue;
			}
			new_ps_ids.push(ps_id);
		}
		new_ps_ids_string = new_ps_ids.join(",");
		role.ps_ids = new_ps_ids_string;
		role.save().then(function (newRole) {
			dao.list("PermissionModel",null,function(err,permissions){
				if (err) return cb({
					msg: "角色：获取最新权限数据失败！",
					code: 500,
					stack: err
				});
				permissionIds = newRole.ps_ids.split(",");
				var permissionKeys = _.keyBy(permissions,'ps_id');
				var result = _.values(getPermissionsResult(permissionKeys,permissionIds));
				cb(null, {
					msg: "角色：删除权限成功！",
					code: 200,
					data: result
				});
			});
		}).catch(function (err) {
			cb({
				msg: "角色：删除权限失败！",
				code: 500,
				stack: err
			});
		})
	});
}

/**
 * 获取所有用户的角色 & 权限
 * 
 * @param  {Function} cb 回调函数
 */
module.exports.getAllRoles = function(conditions, cb) {
	dao.list("RoleModel",{
		where: conditions["where"],
		order: conditions["order"]
	},function(err,roles) {
		if (err) return cb({
			msg: "角色：获取角色列表失败！",
			code: 500,
			stack: err
		});
		dao.list("PermissionModel",null,function(err,permissions){
			if (err) return cb({
				msg: "角色：获取权限列表失败！",
				code: 500,
				stack: err
			});
			// { 
			//  '101':{ id: 1,ps_id: 101,api_service: null,api_action: null,api_path: 'goods',api_order: 3,name: '商品管理',pid: 0,c: '',a: '',level: '0' },
			//  '102':{ id: 2,ps_id: 102,api_service: null,api_action: null,api_path: 'orders',api_order: 4,name: '订单管理',pid: 0,c: '',a: 'order',level: '0' }
			// }
			var permissionKeys = _.keyBy(permissions,'ps_id');
			// [
			// 	{
			// 		"id":30,"name":"主管","desc":"技术负责人",
			// 	 	"ps_ids":"101,104,105,116,117,150,151,152,153,115,142,143,144,121,122,123,149,109,103,111,129,130,134,135,138,139,140,141,112,147,131,132,133,136,137,145,146,148,102,107,125,110",
			// 		"ps_ca":"Goods-index,Goods-tianjia,Category-index,Order-showlist,Brand-index",
			// 	},
			// 	{
			// 		"id":40,"name":"test","ps_ids":"102,0,107,109,154,155,145,146,148","ps_ca":null,"desc":"test"
			// 	},
			// ]
			var rolesResult = [];
			for(idx in roles) {
				role = roles[idx];
				permissionIds = role.ps_ids.split(",");
				roleResult = {
					"id" : role.id,
					"name" : role.name,
					"desc" : role.desc,
					"children" : []
				};
				// _.values:返回对象属性的值的数组
				roleResult.children = _.values(getPermissionsResult(permissionKeys,permissionIds));
				rolesResult.push(roleResult);
			}
			// [ 
			// 	{ id: 30, name: '主管', desc: '技术负责人', children: [ [Object], [Object], [Object], [Object], [Object] ] },
			//  { id: 31,name: '测试角色',desc: '测试角色描述',children: [ [Object], [Object] ] },
			//  { id: 34, name: '测试角色2', desc: '测试描述12', children: [ [Object] ] },
			// ]
			// children:[{"id":101,"name":"商品管理","path":"goods","children":[{"id":105,"name":"添加商品","path":"goods"},{...},...]},{...},{...},{...},{...}]
			cb(null, {
				msg: "角色：获取角色列表成功！",
				code: 200,
				data: rolesResult
			});
		});
		
	});
}

/**
 * 通过角色 ID 获取角色详情
 * 
 * @param  {[type]}   id 角色ID
 * @param  {Function} cb 回调函数
 */
module.exports.getRoleById = function(id,cb){
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "角色：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("RoleModel",id,function(err,role){
		if (err) return cb({
			msg: "角色：获取失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "角色：获取成功！",
			code: 201,
			data: formatData(role)
		});
	});
}

/**
 * 权限验证函数
 * 
 * @param  {[type]}   rid         角色ID
 * @param  {[type]}   serviceName 服务名
 * @param  {[type]}   actionName  动作名（方法）
 * @param  {Function} cb          回调函数
 */
module.exports.authRight = function(userInfo,serviceName,actionName,cb) {
	if(!userInfo || isNaN(parseInt(userInfo.rid))) return cb({
		msg: "禁止访问：令牌没有分配角色ID！",
		code: 403,
		stack: null
	});
	// 超级管理员
	if(userInfo.rid == 0) return cb(null,true);
	// 权限验证
	dao.findOne("PermissionModel",{"api_service":serviceName,"api_action":actionName},function(err,permissionAPI){
		console.log("rid => %s,serviceName => %s,actionName => %s",userInfo.rid,serviceName,actionName);
		if (err) return cb({
			msg: "禁止访问：获取权限失败！",
			code: 500,
			stack: err
		});
		if(!permissionAPI) return cb({
			msg: "禁止访问：接口对应权限不存在！",
			code: 403,
			stack: null
		});
		dao.findOne("RoleModel",{"id":userInfo.rid},function(err,role){
			if (err) return cb({
				msg: "禁止访问：获取角色失败！",
				code: 500,
				stack: err
			});
			if(!role) return cb({
				msg: "禁止访问：角色不存在！",
				code: 403,
				stack: null
			});
			ps_ids = role.ps_ids.split(",");
			for(idx in ps_ids) {
				ps_id = ps_ids[idx];
				if(parseInt(permissionAPI.ps_id) == parseInt(ps_id)) {
					return cb(null,true);
				}
			}
			return cb({
				msg: "禁止访问：无访问权限！",
				code: 403,
				stack: null
			});
		});
	});
}