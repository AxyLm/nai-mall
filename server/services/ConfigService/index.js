var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var formatData = require("./formatData.js");

/**
 *  更新配置
 * 
 *  @param  {[type]}   id   配置ID
 *  @param  {[type]}   data 新数据
 *  @param  {Function} cb   回调函数
 */
 module.exports.updateConfig = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新配置：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("ConfigModel", id, data, function (err, config) {
		if (err) return cb({
			msg: "更新配置：更新失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新配置：更新成功！",
			code: 200,
			data: formatData(config)
		})
	});
}

/**
 *  根据id获取配置对象
 * 
 *  @param  {[type]}   id 配置ID
 *  @param  {Function} cb 回调函数
 */
 module.exports.getConfigById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取配置对象：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("ConfigModel", id, function (err, config) {
		if (err) return cb({
			msg: "获取配置对象：获取失败！",
			code: 500,
			stack: err
		});
		if (!config) return cb({
			msg: "获取配置对象：对象不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "获取配置对象：获取成功！",
			code: 200,
			data: formatData(config)
		});
	});
}