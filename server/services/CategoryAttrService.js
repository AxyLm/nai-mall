var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));

function formatData(data) {
	return {
		id: data.id,
		name: data.name,
		type: data.type,
		vals: data.vals,
		write: data.write,
		catID: data.cat_id
	}
}

/**
 * 创建参数
 * 
 * @param  {[type]}   params 参数信息
 * @param  {Function} cb     回调函数
 */
module.exports.createAttribute = function (params, cb) {
	if (!params.catID) return cb({
		msg: "分类参数：分类ID不能为空！",
		code: 400,
		stack: null
	});
	if (isNaN(parseInt(params.catID))) return cb({
		msg: "分类参数：分类ID必须是数字！",
		code: 400,
		stack: null
	});
	if (!params.name) return cb({
		msg: "分类参数：参数名称不能为空！",
		code: 400,
		stack: null
	});
	if (!params.type || (params.type != "static" && params.type != "dynamic")) return cb({
		msg: "分类参数：参数type类型必须为static或dynamic！",
		code: 400,
		stack: null
	});
	dao.create("CategoryAttrModel", {
		"name": params.name,
		"cat_id": params.catID,
		"type": params.type,
		"write": params.type == "dynamic" ? "list" : "manual",
		"vals": params.vals ? params.vals : ""
	}, function (err, attr) {
		if (err) return cb({
			msg: "分类参数：创建失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "分类参数：创建成功！",
			code: 201,
			data: formatData(attr)
		});
	});
}

/**
 * 删除参数
 * 
 * @param  {[type]}   id	 参数ID
 * @param  {Function} cb     回调函数
 */
module.exports.deleteAttribute = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "分类参数：ID不合法！",
		code: 400,
		stack: null
	});
	dao.destroy("CategoryAttrModel", id, function (err) {
		if (err) return cb({
			msg: "分类参数： 删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "分类参数：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 * 更新参数
 * 
 * @param  {[type]}   id	 属性ID
 * @param  {[type]}   data   更新内容
 * @param  {Function} cb     回调函数
 */
module.exports.updateAttribute = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "分类参数：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("CategoryAttrModel", id, data, function (err, newAttr) {
		if (err) return cb({
			msg: "分类参数：更新失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "分类参数：更新成功！",
			code: 200,
			data: formatData(newAttr)
		});
	});
}

/**
 * 获取属性列表
 * 
 * @param  {[type]}   catID 分类ID
 * @param  {[type]}   type  类型 
 * static:输入框(唯一)  dynamic:后台下拉列表/前台单选框
 * @param  {Function} cb    回调函数
 */
module.exports.getAttributes = function (conditions, cb) {
	var catID = conditions.where.cat_id;
	var type = conditions.where.type;
	if (!catID || isNaN(parseInt(catID))) return cb({
		msg: "分类参数：分类ID不合法！",
		code: 400,
		stack: null
	});
	if (!type || (type != "static" && type != "dynamic")) return cb({
		msg: "分类参数：type类型不正确！",
		code: 400,
		stack: null
	});
	dao.list("CategoryAttrModel", conditions, function (err, attributes) {
		if (err) return cb({
			msg: "分类参数：获取失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "分类参数：获取成功！",
			code: 200,
			data: attributes.map(formatData)
		});
	});
}

module.exports.getAttributeById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "分类参数：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("CategoryAttrModel", id, function (err, attr) {
		if (err) return cb({
			msg: "分类参数：获取失败！",
			code: 500,
			stack: err
		});
		if (!attr) return cb({
			msg: "分类参数：参数不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "分类参数：获取成功！",
			code: 200,
			data: formatData(attr)
		});
	});
}
