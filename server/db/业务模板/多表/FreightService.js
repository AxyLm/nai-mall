var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var freightDeliveryDAO = require(path.join(process.cwd(), "dao/FreightDeliveryDAO"));
var freightConditionDAO = require(path.join(process.cwd(), "dao/FreightConditionDAO"));

function formatData(data) {
	return {
		"id": data.id,
		"name": data.name,
		"delivery_time": data.delivery_time,
		"good_addr_code": data.good_addr_code,
		"good_addr_info": data.good_addr_info,
		"is_free": data.is_free,
		"price_method": data.price_method,
		"specify_free_condition": data.specify_free_condition==1,
		"deleted": data.deleted==1,
		"add_time": data.add_time,
		"upd_time": data.upd_time,
		"freight_delivery": data.freight_delivery || [],
		"freight_condition": data.freight_condition || [],
	}
}

function createDelivery(delivery) {
	return new Promise(function(resolve,reject){
		dao.create("FreightDeliveryModel", delivery, function (err, data) {
            if (err) return reject({
                msg: "保存运送方式：创建运送方式记录失败！",
                code: 500,
                stack: err
            });
            resolve(data);
        });
	});
}

function createCondition(condition) {
	return new Promise(function(resolve,reject){
		dao.create("FreightConditionModel", condition, function (err, data) {
            if (err) return reject({
                msg: "保存包邮条件：创建包邮条件记录失败！",
                code: 500,
                stack: err
            });
            resolve(data);
        });
	});
}

function getAllDeliverys(info) {
	return new Promise(function(resolve,reject){
		dao.list("FreightDeliveryModel",{ where:{freight_id:info.id} }, function(err, data){
			if(err) return reject({
                msg: "获取运送方式：获取运送方式记录失败！",
                code: 500,
                stack: err
            });
			info.freight_delivery = data;
			resolve(info);
		});
	});
}

function getAllConditions(info) {
	return new Promise(function(resolve,reject){
		dao.list("FreightConditionModel",{ where:{freight_id:info.id} }, function(err, data){
			if(err) return reject({
                msg: "获取包邮条件：获取包邮条件记录失败！",
                code: 500,
                stack: err
            });
			info.freight_condition = data;
			resolve(info);
		});
	});
}

function saveDelivery(info){
	return new Promise(function(resolve,reject){
		freightDeliveryDAO.clear(info.id,function (err) {
			if (err) return reject({
                msg: "清理运送方式：清理原始数据失败！",
                code: 500,
                stack: err
            });
			var createFns = [];
			info.freight_delivery.forEach(function(newDelivery){
				newDelivery.freight_id = info.id;
				createFns.push(createDelivery(newDelivery));
			});
			if (createFns.length == 0) return resolve(info);
            Promise.all(createFns).then(_=>resolve(info)).catch(reject);
		});
	});	
}

function saveCondition(info){
	return new Promise(function(resolve,reject){
		freightConditionDAO.clear(info.id,function (err) {
			console.log(err);
			if (err) return reject({
                msg: "清理包邮条件：清理原始数据失败！",
                code: 500,
                stack: err
            });
			var createFns = [];
			info.freight_condition.forEach(function(newCondition){
				newCondition.freight_id = info.id;
				createFns.push(createCondition(newCondition));
			});
			if (createFns.length == 0) return resolve(info);
            Promise.all(createFns).then(_=>resolve(info)).catch(reject);
		});
	});	
}

/**
 *  添加运费模板
 * 
 *  @param {[type]}   params 运费模板数据 
 *  @param {Function} cb  回调函数
 */
module.exports.createFreight = function (params, cb) {
	if(!Array.isArray(params.freight_delivery)){
		return cb({
			msg: "添加运费模板：freight_delivery数据格式错误！",
			code: 400,
			stack: null
		});
	}
	if(!Array.isArray(params.freight_condition)){
		return cb({
			msg: "添加运费模板：freight_condition数据格式错误！",
			code: 400,
			stack: null
		});
	}
	dao.create("FreightModel", params, function (err, freight) {
		if (err) return cb({
			msg: "添加运费模板：添加失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		Object.assign(params,JSON.parse(JSON.stringify(freight)));
		saveDelivery(params)
		.then(saveCondition)
		.then(getAllDeliverys)
		.then(getAllConditions)
		.then(function(data){
			cb(null, {
				msg: "添加运费模板：创建成功！",
				code: 201,
				data: formatData(data)
			});
		})
		.catch(cb);
	});
}

/**
 *  删除运费模板
 * 
 *  @param  {[type]}   id     运费模板ID
 *  @param  {Function} cb     回调函数
 */
module.exports.deleteFreight = function (id, cb) {
	if (!id) return cb({
		msg: "删除运费模板：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "删除运费模板：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.destroyMany("FreightModel", id, function (err) {
		if (err) return cb({
			msg: "删除运费模板：删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "删除运费模板：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 *  更新运费模板
 * 
 *  @param  {[type]}   id   运费模板ID
 *  @param  {[type]}   params 新数据
 *  @param  {Function} cb   回调函数
 */
module.exports.updateFreight = function (id, params, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新运费模板：ID不合法！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(params.freight_delivery)){
		return cb({
			msg: "更新运费模板：freight_delivery数据格式错误！",
			code: 400,
			stack: null
		});
	}
	if(!Array.isArray(params.freight_condition)){
		return cb({
			msg: "更新运费模板：freight_condition数据格式错误！",
			code: 400,
			stack: null
		});
	}
	dao.update("FreightModel", id, params, function (err, freight) {
		if (err) return cb({
			msg: "更新运费模板：更新失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		Object.assign(params,JSON.parse(JSON.stringify(freight)));
		saveDelivery(params)
		.then(saveCondition)
		.then(getAllDeliverys)
		.then(getAllConditions)
		.then(function(data){
			cb(null, {
				msg: "更新运费模板：更新成功！",
				code: 200,
				data: formatData(data)
			});
		})
		.catch(cb);
	});
}

/**
 *  修改运费模板删除状态
 * 
 *  @param  {[type]}   id      运费模板ID
 *  @param  {[type]}   deleted 0未删除 1已删除
 *  @param  {Function} cb      回调函数
 */
module.exports.updateFreightDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新运费模板删除状态：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("FreightModel", id, {"deleted": deleted }, function (err, freight) {
		if (err) return cb({
			msg: "更新运费模板删除状态：设置状态失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新运费模板删除状态：设置状态成功！",
			code: 200,
			data: formatData(freight)
		});
	});
}

/**
 *  根据条件获取运费模板列表
 *  @param  {[type]}   conditions 查询条件
 *  conditions{
		"where" : 条件查询,
		"order" : 排序
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 *  @param  {Function} cb         回调函数
 */
module.exports.getAllFreights = function (conditions, cb) {
	if (!conditions.pagenum || conditions.pagenum <= 0) return cb({
		msg: "获取运费模板列表：pagenum 参数不合法！",
		code: 400,
		stack: null
	});
	if (!conditions.pagesize || conditions.pagesize <= 0) return cb({
		msg: "获取运费模板列表：pagesize 参数不合法！",
		code: 400,
		stack: null
	});
	dao.countByConditions("FreightModel",conditions, function (err, count) {
		if(err) return cb({
			msg: "获取运费模板列表：获取总数失败！",
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
		dao.list("FreightModel",{
			offset: offset, 
			limit: limit,
			where: conditions["where"],
			order: conditions["order"] || "-add_time"
		}, function (err, freight) {
			if(err) return cb({
				msg: "获取运费模板列表：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["freight"] = freight.map(formatData);
			cb(null, {
				msg: "获取运费模板列表：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 *  根据id获取运费模板对象
 * 
 *  @param  {[type]}   id 运费模板ID
 *  @param  {Function} cb 回调函数
 */
module.exports.getFreightById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取运费模板对象：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("FreightModel", id, function (err, freight) {
		if (err) return cb({
			msg: "获取运费模板对象：获取失败！",
			code: 500,
			stack: err
		});
		if (!freight) return cb({
			msg: "获取运费模板对象：对象不存在！",
			code: 403,
			stack: null
		});
		getAllDeliverys(freight)
		.then(getAllConditions)
		.then(function(freight){
			cb(null, {
				msg: "获取运费模板对象：获取成功！",
				code: 200,
				data: formatData(freight)
			})
		})
		.catch(cb);
	});
}