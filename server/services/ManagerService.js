var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var Password = require("node-php-password");
var _ = require("lodash");

function formatData(data) {
	return {
		id: data.id,
		role_id: data.role_id,
		name: data.name,
		role_name: data.role_name,
		mobile: data.mobile,
		email: data.email,
		avatar: data.avatar,
		deleted: data.deleted==1,
		add_time: data.add_time,
	}
}

/**
 * 创建管理员
 * 
 * @param  {[type]}   user 用户数据集
 * @param  {Function} cb   回调函数
 */
module.exports.createManager = function (params, cb) {
	if (!params.name) {
		return cb({
			msg: "管理员：用户名不能为空！",
			code: 400,
			stack: null
		});
	}
	if (!params.password) {
		return cb({
			msg: "管理员：密码不能为空！",
			code: 400,
			stack: null
		});
	}
	if (!params.role_id || isNaN(parseInt(params.role_id))) {
		params.role_id = -1;
	}
	dao.countByConditions("ManagerModel",{where:{name:params.name}}, function (err, count) {
		if (err) return cb({
			msg: "管理员：判断用户是否存在失败！",
			code: 500,
			stack: err
		});
		if (count>0) return cb({
			msg: "管理员：用户名已存在！",
			code: 403,
			stack: null
		});
		dao.create("ManagerModel",{
			"name": params.name,
			"pwd": Password.hash(params.password),
			"mobile": params.mobile,
			"email": params.email,
			"time": (Date.parse(new Date()) / 1000),
			"role_id": params.role_id,
			"deleted":0
		}, async function (err, manager) {
			if (err) return cb({
				msg: "管理员：创建失败！",
				code: 500,
				stack: err
			});
			var role_name = "";
			if (manager.role_id==0) {
				role_name = "超级管理员";
			} else {
				var role = await manager.getRoleModel();
				role && (role_name = role.name);
			}
			manager.role_name = role_name;
			cb(null, {
				msg: "管理员：创建成功！",
				code: 201,
				data: formatData(manager)
			});
		});
	});
}

/**
 * 通过管理员 ID 进行删除操作
 * 
 * @param  {[type]}   id 管理员ID
 * @param  {Function} cb 回调函数
 */
module.exports.deleteManager = function (id, cb) {
	if (!id) return cb({
		msg: "管理员：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "管理员：ID必须是数字！",
		code: 400,
		stack: null
	});
	if(id.some(item=>item==500)) return cb({
		msg: "管理员：不允许删除admin账户！",
		code: 400,
		stack: null
	});
	dao.destroyMany("ManagerModel",id, function (err) {
		if (err) return cb({
			msg: "管理员： 删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "管理员：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 * 更新管理员信息
 * 
 * @param  {[type]}   data 管理员信息
 * @param  {Function} cb     回调函数
 */
module.exports.updateManager = function (id, uid, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "管理员：ID不合法！",
		code: 400,
		stack: null
	});
	console.log(data);
	if(data.pwd){
		data.pwd = Password.hash(data.pwd);
	}
	if(id==500 && uid!=500){
		return cb({
			msg: "管理员：不允许修改admin账户！",
			code: 400,
			stack: null
		});
	}
	dao.update("ManagerModel",id, data,async function (err, manager) {
		if (err) return cb({
			msg: "管理员：更新失败！",
			code: 500,
			stack: err
		});
		var role_name = "";
		if (manager.role_id==0) {
			role_name = "超级管理员";
		} else {
			var role = await manager.getRoleModel();
			role && (role_name = role.name);
		}
		manager.role_name = role_name;
		cb(null, {
			msg: "管理员：更新成功！",
			code: 200,
			data: formatData(manager)
		});
	})
}

/**
 * 修改管理员删除状态
 * 
 * @param  {[type]}   id        管理员ID
 * @param  {[type]}   deleted   删除状态
 * @param  {Function} cb        回调函数
 */
module.exports.updateMgrDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "管理员：ID不合法！",
		code: 400,
		stack: null
	});
	if(id==500) return cb({
		msg: "管理员：不允许禁用admin账户！",
		code: 400,
		stack: null
	});
	dao.findByID("ManagerModel",id, function (err, manager) {
		if (err) return cb({
			msg: "管理员：获取失败！",
			code: 500,
			stack: err
		});
		if (!manager) return cb({
			msg: "管理员：用户不存在！",
			code: 403,
			stack: null
		});
		dao.update("ManagerModel", manager.id, {"deleted": deleted }, async function (err, manager) {
			if (err) return cb({
				msg: "管理员：设置失败！",
				code: 500,
				stack: err
			});
			var role_name = "";
			if (manager.role_id==0) {
				role_name = "超级管理员";
			} else {
				var role = await manager.getRoleModel();
				role && (role_name = role.name);
			}
			manager.role_name = role_name;
			cb(null, {
				msg: "管理员：设置成功！",
				code: 200,
				data: formatData(manager)
			});
		});
	});
}

/**
 * 为管理员设置角色
 * 
 * @param {[type]}   id  管理员ID
 * @param {[type]}   rid 角色ID
 * @param {Function} cb  回调函数
 */
module.exports.setRole = function (id, role_id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "管理员：ID不合法！",
		code: 400,
		stack: null
	});
	if (!role_id || isNaN(parseInt(role_id))) return cb({
		msg: "管理员：权限ID不合法！",
		code: 400,
		stack: null
	});
	if(id==500) return cb({
		msg: "管理员：不允许更改admin账户角色！",
		code: 400,
		stack: null
	});
	dao.findByID("ManagerModel",id, function (err, manager) {
		if (err) return cb({
			msg: "管理员：获取失败！",
			code: 500,
			stack: err
		});
		if (!manager) return cb({
			msg: "管理员：用户不存在！",
			code: 403,
			stack: null
		});
		dao.update("ManagerModel", manager.id, { "role_id": role_id }, async function (err, manager) {
			if (err) return cb({
				msg: "管理员：设置失败！",
				code: 500,
				stack: err
			});
			var role_name = "";
			if (manager.role_id==0) {
				role_name = "超级管理员";
			} else {
				var role = await manager.getRoleModel();
				role && (role_name = role.name);
			}
			manager.role_name = role_name;
			cb(null, {
				msg: "管理员：设置成功！",
				code: 200,
				data: formatData(manager)
			});
		});
	});
}

/**
 * 获取所有管理员
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"where" : 条件查询,
		"order" : 排序
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 * @param  {Function} cb         回调函数
 */
module.exports.getAllManagers = function (conditions, cb) {
	if (!conditions.pagenum || conditions.pagenum <= 0) return cb({
		msg: "pagenum 参数不合法！",
		code: 400,
		stack: null
	});
	if (!conditions.pagesize || conditions.pagesize <= 0) return cb({
		msg: "pagesize 参数不合法！",
		code: 400,
		stack: null
	});
	// 通过关键词获取管理员数量
	dao.countByConditions("ManagerModel",conditions, function (err, count) {
		if(err) return cb({
			msg: "管理员：获取总数失败！",
			code: 500,
			stack: err
		});
		pagenum = parseInt(conditions["pagenum"]);
		pagesize = parseInt(conditions["pagesize"]);
		pageCount = Math.ceil(count / pagesize);
		offset = (pagenum - 1) * pagesize;
		if (offset >= count) {
			offset = count;
		}
		limit = pagesize;
		dao.list("ManagerModel",{
			offset, limit,
			where: conditions["where"],
			order: conditions["order"]
		}, async function (err, managers) {
			if(err) return cb({
				msg: "管理员：获取分页数据失败！",
				code: 500,
				stack: err
			});
			for (idx in managers) {
				var manager = managers[idx];
				var role_name = "";
				if (manager.role_id==0) {
					role_name = "超级管理员";
				} else {
					var role = await manager.getRoleModel();
					role && (role_name = role.name);
				}
				manager.role_name = role_name;
			}
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["managers"] = managers.map(formatData);
			cb(null, {
				msg: "管理员：获取列表成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 * 通过管理员 ID 获取管理员信息
 * 
 * @param  {[type]}   id 管理员 ID
 * @param  {Function} cb 回调函数
 */
module.exports.getManagerById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "管理员：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("ManagerModel",id, async function (err, manager) {
		if (err) return cb({
			msg: "管理员：获取失败！",
			code: 500,
			stack: err
		});
		if (!manager) return cb({
			msg: "管理员：用户不存在！",
			code: 403,
			stack: null
		});
		var role_name = "";
		if (manager.role_id==0) {
			role_name = "超级管理员";
		} else {
			var role = await manager.getRoleModel();
			role && (role_name = role.name);
		}
		manager.role_name = role_name;
		cb(null, {
			msg: "管理员：获取成功！",
			code: 200,
			data: formatData(manager)
		});
	});
}

/**
 * 获取当前登录用户的信息
 * 
 * @param  {[type]}   id 登录用户 ID
 * @param  {Function} cb 回调函数
 */
module.exports.getMe = function (id, cb) {
	dao.findByID("ManagerModel",id, async function (err, manager) {
		if (err) return cb({
			msg: "管理员：获取当前登录用户失败！",
			code: 500,
			stack: err
		});
		if (!manager) return cb({
			msg: "管理员：当前登录用户不存在！",
			code: 403,
			stack: null
		});
		var role_name = "";
		if (manager.role_id==0) {
			role_name = "超级管理员";
		} else {
			var role = await manager.getRoleModel();
			role && (role_name = role.name);
		}
		manager.role_name = role_name;
		cb(null, {
			msg: "管理员：获取成功！",
			code: 200,
			data: formatData(manager)
		});
	});
}

/**
 * 管理员登录
 * @param  {[type]}   username 用户名
 * @param  {[type]}   password 密码
 * @param  {Function} cb       回调
 */
module.exports.login = function (username, password, cb) {
	dao.findOne("ManagerModel",{ "name": username }, async function (err, manager) {
		if (err) return cb({
			msg: "登录：用户查询失败！",
			code: 500,
			stack: err
		});
		if (!manager) return cb({
			msg: "登录：该用户不存在！",
			code: 400,
			stack: null
		});
		if (manager.role_id < 0) return cb({
			msg: "登录：该用户无登录权限！",
			code: 400,
			stack: null
		});
		if (manager.role_id > 0 && manager.deleted == 0) return cb({
			msg: "登录：该用户已被禁用！",
			code: 400,
			stack: null
		});
		if (Password.verify(password, manager.pwd)) {
			var role_name = "";
			if (manager.role_id==0) {
				role_name = "超级管理员";
			} else {
				var role = await manager.getRoleModel();
				role && (role_name = role.name);
			}
			manager.role_name = role_name;
			cb(null, {
				msg: "登录：登录成功！",
				code: 200,
				data: formatData(manager)
			});
		} else {
			return cb({
				msg: "登录：密码错误！",
				code: 400,
				stack: null
			});
		}
	});
}