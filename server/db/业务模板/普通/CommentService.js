var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));

function formatData(data) {
	return {
		"id": data.id,
		"order_id": data.order_id,
		"order_code": data.order_code,
		"user_id": data.user_id,
		"user_name": data.user_name,
		"content": data.content,
		"overall_rating": data.overall_rating,
		"good_rating": data.good_rating,
		"delivery_rating": data.delivery_rating,
		"service_rating": data.service_rating,
		"deleted": data.deleted==1,
		"add_time": data.add_time,
		"upd_time": data.upd_time
	}
}

/**
 *  添加评价
 * 
 *  @param {[type]}   params 评价数据 
 *  @param {Function} cb  回调函数
 */
module.exports.createComment = function (params, cb) {
	dao.create("CommentModel", params, function (err, comment) {
		if (err) return cb({
			msg: "添加评价：添加失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "添加评价：添加成功！",
			code: 201,
			data: formatData(comment)
		});
	});
}

/**
 *  删除评价
 * 
 *  @param  {[type]}   id     评价ID
 *  @param  {Function} cb     回调函数
 */
module.exports.deleteComment = function (id, cb) {
	if (!id) return cb({
		msg: "删除评价：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "删除评价：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.destroyMany("CommentModel", id, function (err) {
		if (err) return cb({
			msg: "删除评价：删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "删除评价：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 *  更新评价
 * 
 *  @param  {[type]}   id   评价ID
 *  @param  {[type]}   data 新数据
 *  @param  {Function} cb   回调函数
 */
module.exports.updateComment = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新评价：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("CommentModel", id, data, function (err, comment) {
		if (err) return cb({
			msg: "更新评价：更新失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新评价：更新成功！",
			code: 200,
			data: formatData(comment)
		});
	});
}

/**
 *  修改评价删除状态
 * 
 *  @param  {[type]}   id      评价ID
 *  @param  {[type]}   deleted 0未删除 1已删除
 *  @param  {Function} cb      回调函数
 */
module.exports.updateCommentDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "更新评价删除状态：ID不合法！",
		code: 400,
		stack: null
	});
	dao.update("CommentModel", id, {"deleted": deleted }, function (err, comment) {
		if (err) return cb({
			msg: "更新评价删除状态：设置状态失败！",
			code: err.name=="SequelizeValidationError" ? 400 : 500,
			stack: err
		});
		cb(null, {
			msg: "更新评价删除状态：设置状态成功！",
			code: 200,
			data: formatData(comment)
		});
	});
}

/**
 *  根据条件获取评价列表
 *  @param  {[type]}   conditions 查询条件
 *  conditions{
		"where" : 条件查询,
		"order" : 排序
		"pagenum" : 页数,
		"pagesize" : 每页长度
	}
 *  @param  {Function} cb         回调函数
 */
module.exports.getAllComments = function (conditions, cb) {
	if (!conditions.pagenum || conditions.pagenum <= 0) return cb({
		msg: "获取评价列表：pagenum 参数不合法！",
		code: 400,
		stack: null
	});
	if (!conditions.pagesize || conditions.pagesize <= 0) return cb({
		msg: "获取评价列表：pagesize 参数不合法！",
		code: 400,
		stack: null
	});
	dao.countByConditions("CommentModel",conditions, function (err, count) {
		if(err) return cb({
			msg: "获取评价列表：获取总数失败！",
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
		dao.list("CommentModel",{
			offset: offset, 
			limit: limit,
			where: conditions["where"],
			order: conditions["order"] || "-add_time"
		}, function (err, comment) {
			if(err) return cb({
				msg: "获取评价列表：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["comment"] = comment.map(formatData);
			cb(null, {
				msg: "获取评价列表：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 *  根据id获取评价对象
 * 
 *  @param  {[type]}   id 评价ID
 *  @param  {Function} cb 回调函数
 */
module.exports.getCommentById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "获取评价对象：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("CommentModel", id, function (err, comment) {
		if (err) return cb({
			msg: "获取评价对象：获取失败！",
			code: 500,
			stack: err
		});
		if (!comment) return cb({
			msg: "获取评价对象：对象不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "获取评价对象：获取成功！",
			code: 200,
			data: formatData(comment)
		});
	});
}