var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));

function formatData(data) {
	return {
		"id": data.id,
		"name": data.name,
		"area_code": data.area_code,
		"area_info": data.area_info,
		"street_info": data.street_info,
		"deleted": data.deleted==1,
		"add_time": data.add_time,
		"upd_time": data.upd_time
	}
}

/**
 *  添加门店
 * 
 *  @param {[type]}   params 门店数据 
 *  @param {Function} cb  回调函数
 */
module.exports.createConfigStore = function (params, cb) {
	dao.create("ConfigStoreModel", params, function (err, store) {
		if (err) return cb({
			msg: "添加门店：添加失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "添加门店：添加成功！",
			code: 201,
			data: formatData(store)
		});
	});
}

/**
 *  删除门店
 * 
 *  @param  {[type]}   id     门店ID
 *  @param  {Function} cb     回调函数
 */
module.exports.deleteConfigStore = function (id, cb) {
	if (!id) return cb({
		msg: "删除门店：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "删除门店：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.destroyMany("ConfigStoreModel", id, function (err) {
		if (err) return cb({
			msg: "删除门店：删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "删除门店：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 *  更新门店
 * 
 *  @param  {[type]}   id   门店ID
 *  @param  {[type]}   data 新数据
 *  @param  {Function} cb   回调函数
 */
module.exports.updateConfigStore = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新门店：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("ConfigStoreModel", id, data, function (err, store) {
		if (err) return cb({
			msg: "更新门店：更新失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新门店：更新成功！",
			code: 200,
			data: formatData(store)
		});
	});
}

/**
 *  修改门店删除状态
 * 
 *  @param  {[type]}   id      门店ID
 *  @param  {[type]}   deleted 0未删除 1已删除
 *  @param  {Function} cb      回调函数
 */
module.exports.updateConfigStoreDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新门店删除状态：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("ConfigStoreModel", id, {"deleted": deleted }, function (err, store) {
		if (err) return cb({
			msg: "更新门店删除状态：设置状态失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新门店删除状态：设置状态成功！",
			code: 200,
			data: formatData(store)
		});
	});
}

/**
 *  根据条件获取门店列表
 *  @param  {[type]}   conditions 查询条件
 *  conditions{
		"where" : 条件查询,
		"order" : 排序
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 *  @param  {Function} cb         回调函数
 */
module.exports.getAllConfigStores = function (conditions, cb) {
	if (!conditions.pagenum || conditions.pagenum <= 0) return cb({
		msg: "获取门店列表：pagenum 参数不合法！",
		code: 400,
		stack: null
	});
	if (!conditions.pagesize || conditions.pagesize <= 0) return cb({
		msg: "获取门店列表：pagesize 参数不合法！",
		code: 400,
		stack: null
	});
	dao.countByConditions("ConfigStoreModel",conditions, function (err, count) {
		if(err) return cb({
			msg: "获取门店列表：获取总数失败！",
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
		dao.list("ConfigStoreModel",{
			offset: offset, 
			limit: limit,
			where: conditions["where"],
			order: conditions["order"] || "-add_time"
		}, function (err, store) {
			if(err) return cb({
				msg: "获取门店列表：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["store"] = store.map(formatData);
			cb(null, {
				msg: "获取门店列表：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 *  根据id获取门店对象
 * 
 *  @param  {[type]}   id 门店ID
 *  @param  {Function} cb 回调函数
 */
module.exports.getConfigStoreById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取门店对象：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("ConfigStoreModel", id, function (err, store) {
		if (err) return cb({
			msg: "获取门店对象：获取失败！",
			code: 500,
			stack: err
		});
		if (!store) return cb({
			msg: "获取门店对象：对象不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "获取门店对象：获取成功！",
			code: 200,
			data: formatData(store)
		});
	});
}