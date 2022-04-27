var _ = require('lodash');
var path = require("path");
var url = require("url");
var fs = require("fs");
var Password = require("node-php-password");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var gm = require("gm");
var upload_config = require("config").get("upload_config");

function formatData(data) {
	return {
		"id": data.id,
		"telephone": data.telephone,
		"nick_name": data.nick_name,
		"real_name": data.real_name,
		"email": data.email,
		"avatar": data.avatar ? upload_config.get("baseURL")+data.avatar : null,
		"deleted": data.deleted==1,
		"add_time": data.add_time,
		"upd_time": data.upd_time
	}
}
// 移除旧的头像文件
function doRemoveOldAvatarFile(info) {
	return new Promise(function (resolve,reject) {
		if(!info.oldPath) return resolve(info);
		fs.unlink(info.oldPath, function (err) {
			if(err) return reject({
				msg: "会员：移除头像文件失败！",
				code: 500,
				stack: err
			});
			resolve(info);
		});
	})
}
// 添加新上传的头像文件
function doSaveNewAvatarFile(info) {
	return new Promise(function (resolve,reject) {
		if(!info.data.avatar) return resolve(info);
		var filename = path.basename(info.data.avatar);
		var srcPath = path.join(process.cwd(), info.data.avatar);
		var savePath = path.join(process.cwd(), "/uploads/member/"+filename);
		gm(srcPath).resize(800, 800).autoOrient().write(savePath, function (err) {
			if(err) return reject({
				msg: "会员：新头像图片裁剪失败！",
				code: 500,
				stack: err
			});
			info.data.avatar = "/uploads/member/"+filename;
			resolve(info);
		});
	});
}

// 更新会员记录
function doUpdateMember(info) {
	return new Promise(function (resolve, reject) {
		dao.update("MemberModel", info.id, info.data, function (err, member) {
			if (err) return reject({
				msg: "会员：记录更新失败！",
				code: err.name=="SequelizeValidationError" ? 400 : 500,
				stack: err
			});
			resolve(member);
		});
	})
}

// 创建新会员记录
function doCreateMember(info) {
	return new Promise(function (resolve,reject) {
		dao.create("MemberModel", info.data, function (err, member) {
			if (err) return reject({
				msg: "会员：记录创建失败！",
				code: err.name=="SequelizeValidationError" ? 400 : 500,
				stack: err
			});
			resolve(member);
		});
	});
}

/**
 * 添加会员
 * 
 * @param {[type]}   params 会员数据 
 * @param {Function} cb  回调函数
 */
module.exports.createMember = function (params, cb) {
	if (params.avatar) {
		params.avatar = url.parse(params.avatar).pathname
	}
	params.password = Password.hash(params.password);
	doSaveNewAvatarFile({
		data: params
	})
	.then(doCreateMember)
	.then(function (member) {
		cb(null, {
			msg: "会员：创建成功！",
			code: 201,
			data: formatData(member)
		});
	})
	.catch(cb);
}

/**
 * 删除会员
 * 
 * @param  {[type]}   id     会员ID
 * @param  {Function} cb     回调函数
 */
module.exports.deleteMember = function (id, cb) {
	if (!id) return cb({
		msg: "会员删除：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "会员删除：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.list('MemberModel',{where:{ id:id },attributes:['avatar']},function (err,members) {
		if (err) return cb({
			msg: "会员删除：删除失败，查询数据出差！",
			code: 500,
			stack: err
		});
		members = members || [];
		var batchFns = [];
		members.map(function (it) {
			batchFns.push(doRemoveOldAvatarFile({
				oldPath:it.avatar ? path.join(process.cwd(),it.avatar) : null
			}))
		});
		Promise.all(batchFns).then(function () {
			dao.destroyMany("MemberModel", id, function (err) {
				if (err) return cb({
					msg: "会员删除：删除失败！",
					code: 500,
					stack: err
				});
				cb(null,{
					msg: "会员删除：删除成功！",
					code: 200,
					data: null
				});
			});
		}).catch(cb);
	})
}

/**
 * 更新会员
 * 
 * @param  {[type]}   id   会员ID
 * @param  {[type]}   data 新数据
 * @param  {Function} cb   回调函数
 */
module.exports.updateMember = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "会员更新：ID不合法！",
		code: 400,
		stack: null
	});
	if(!data.avatar) {
		delete data.avatar
	}else{
		data.avatar = url.parse(data.avatar).pathname;
	};
	if(!data.telephone) delete data.telephone;
	if(!data.password) {
		delete data.password
	}else{
		data.password = Password.hash(data.password);
	};
	if(!data.nick_name) delete data.nick_name;
	if(!data.real_name) delete data.real_name;
	if(!data.email) delete data.email;
	if(!data.avatar) delete data.avatar;
	dao.findByID("MemberModel",id, function (err, member) {
		if (err || !member) return cb({
			msg: "会员更新：更新失败，查询数据出差！",
			code: 500,
			stack: err
		});
		// 说明上传了新的头像
		if(data.avatar && (member.avatar!=data.avatar)){
			var oldPath = member.avatar ? path.join(process.cwd(),member.avatar) : null;
			// 移除旧头像
			doRemoveOldAvatarFile({
				oldPath: oldPath,
				id:id,
				data: data
			})
			// 存储新头像
			.then(doSaveNewAvatarFile)
			// 更新数据库
			.then(doUpdateMember)
			.then(function (member) {
				cb(null, {
					msg: "会员更新：更新成功！",
					code: 200,
					data: formatData(member)
				});
			})
			.catch(cb);
		}else{
			doUpdateMember({
				id:id, data:data
			})
			.then(function (member) {
				cb(null, {
					msg: "会员更新：更新成功！",
					code: 200,
					data: formatData(member)
				});
			})
			.catch(cb);
		}
		
	});
}

/**
 * 修改会员删除状态
 * 
 * @param  {[type]}   id      会员ID
 * @param  {[type]}   deleted 0未删除 1已删除
 * @param  {Function} cb      回调函数
 */
module.exports.updateMebDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "设置会员删除状态：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("MemberModel",id, function (err, member) {
		if (err) return cb({
			msg: "设置会员删除状态：获取失败！",
			code: 500,
			stack: err
		});
		if (!member) return cb({
			msg: "设置会员删除状态：不存在！",
			code: 403,
			stack: null
		});
		dao.update("MemberModel", member.id, {"deleted": deleted }, function (err, member) {
			if (err) return cb({
				msg: "设置会员删除状态：设置状态失败！",
				code: err.name=="SequelizeValidationError" ? 400 : 500,
				stack: err
			});
			cb(null, {
				msg: "设置会员删除状态：设置状态成功！",
				code: 200,
				data: formatData(member)
			});
		});
	});
}

/**
 * 根据条件获取会员列表
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
module.exports.getAllMembers = function (conditions, cb) {
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
	dao.countByConditions("MemberModel",conditions, function (err, count) {
		if(err) return cb({
			msg: "会员列表：获取总数失败！",
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
		dao.list("MemberModel",{
			offset: offset, 
			limit: limit,
			where: conditions["where"],
			order: conditions["order"] || "-add_time"
		}, function (err, member) {
			if(err) return cb({
				msg: "会员列表：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["member"] = member.map(formatData);
			cb(null, {
				msg: "会员列表：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 * 根据id获取会员对象
 * 
 * @param  {[type]}   id 会员ID
 * @param  {Function} cb 回调函数
 */
module.exports.getMemberById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取会员对象：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("MemberModel", id, function (err, member) {
		if (err) return cb({
			msg: "获取会员对象：获取失败！",
			code: 500,
			stack: err
		});
		if (!member) return cb({
			msg: "获取会员对象：不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "获取会员对象：获取成功！",
			code: 200,
			data: formatData(member)
		});
	});
}