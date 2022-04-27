var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var categoryDAO = require(path.join(process.cwd(), "dao/CategoryDAO"));

function formatData(data) {
	return {
		"id": data.id,
		"pid": data.pid,
		"name": data.name,
		"level": data.level,
		"deleted": data.deleted==1
	}
}

/**
 * 判断是否删除
 * 
 * @param  {[type]}  keyCategories 所有数据
 * @param  {[type]}  cat           [description]
 * @return {Boolean}               [description]
 */
function isDelete(keyCategories, cat) {
	// 顶级分类
	// 直接返回，删除状态
	if (cat.pid == 0) {
		return cat.deleted;
		// 非顶级分类
		// 如果该分类被删除了，直接返回
	} else if (cat.deleted) {
		return true;
		// 如果该分类没被删除，递归返回父级分类的删除状态
	} else {
		parentCat = keyCategories[cat.pid];
		if (!parentCat) return true;
		return isDelete(keyCategories, parentCat);
	}
}

/**
 * 获取树状结果
 * @param  {[type]} keyCategories [以id为键名的JSON对象]
 * @param  {[type]} categories    [商品分类对象数组]
 * @return {[type]}               [树状列表]
 */
function getTreeResult(keyCategories, categories, type) {
	var result = [];
	for (idx in categories) {
		var cat = categories[idx];
		// 判断是否被删除,转移到了前台
		// if(isDelete(keyCategories,cat)) continue;
		if (cat.pid == 0) {
			result.push(cat);
		} else {
			if (cat.level >= type) continue;
			var parantCat = keyCategories[cat.pid];
			if (!parantCat) continue;
			if (!parantCat.children) {
				parantCat["children"] = [];
			}
			parantCat.children.push(cat);
		}
	}
	return result;
}

/**
 * 添加分类
 * 
 * @param {[type]}   cat 分类数据 
 * { 
 *     pid  => 父类ID(如果是根类就赋值为0),
 *     name => 分类名称,
 *     level => 层级 (顶层为 0)
 * }
 * 
 * @param {Function} cb  回调函数
 */
module.exports.createCategory = function (params, cb) {
	if (!params.name) {
		return cb({
			msg: "商品分类：分类名称不能为空！",
			code: 400,
			stack: null
		});
	}
	dao.create("CategoryModel", { 
		"pid": params.pid, 
		"name": params.name, 
		"level": params.level 
	}, function (err, newCat) {
		if (err) return cb({
			msg: "商品分类：创建失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "商品分类：创建成功！",
			code: 201,
			data: formatData(newCat)
		});
	});
}

/**
 * 删除分类
 * 
 * @param  {[type]}   id     分类ID
 * @param  {Function} cb     回调函数
 */
module.exports.deleteCategory = function (id, cb) {
	if (!id) return cb({
		msg: "商品分类：ID不能为空！",
		code: 400,
		stack: null
	});
	if(!Array.isArray(id)) id = [id];
	if (id.every(item=>isNaN(parseInt(item)))) return cb({
		msg: "商品分类：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.destroyMany("CategoryModel", id, function (err) {
		if (err) return cb({
			msg: "商品分类：删除失败！",
			code: 500,
			stack: err
		});
		cb(null,{
			msg: "商品分类：删除成功！",
			code: 200,
			data: null
		});
	});
}

/**
 * 更新分类
 * 
 * @param  {[type]}   id      分类ID
 * @param  {[type]}   newName 新的名称
 * @param  {Function} cb      回调函数
 */
module.exports.updateCategory = function (id, newName, cb) {
	var data = {};
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "商品分类：ID不合法！",
		code: 400,
		stack: null
	});
	if(newName){
		data.name = newName;
	}
	dao.update("CategoryModel", id, data, function (err, newCat) {
		if (err) return cb({
			msg: "商品分类：更新失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "商品分类：更新成功！",
			code: 200,
			data: formatData(newCat)
		});
	});
}

/**
 * 修改分类删除状态
 * 
 * @param  {[type]}   id     分类ID
 * @param  {Function} cb     回调函数
 */
module.exports.updateCategoryDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "商品分类：ID不合法！",
		code: 400,
		stack: null
	});
	categoryDAO.changeDeleted(id, deleted, function (err) {
		if (err) return cb({
			msg: "商品分类：切换删除状态失败！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "商品分类：切换删除状态成功！",
			code: 200,
			data: null
		});
	});
}

/**
 * 获取所有分类
 * @param  {[type]}   type    描述显示层级
 * @param  {Function} cb      回调函数
 */
module.exports.getAllCategories = function (type, conditions, cb) {
	dao.list("CategoryModel", conditions, function (err, categories) {
		if (err) return cb({
			msg: "商品分类：获取分类列表失败！",
			code: 500,
			stack: err
		});
		categories = categories.map(formatData);
		var keyCategories = _.keyBy(categories, "id");
		if (!type) type = 3;
		var result = getTreeResult(keyCategories, categories, type);
		if (conditions && conditions.pagesize && conditions.pagenum) {
			var count = result.length;
			var pagesize = parseInt(conditions.pagesize);
			var pagenum = parseInt(conditions.pagenum) - 1;
			// _.take([1, 2, 3]); ==> [1]
			// _.take([1, 2, 3],2); ==> [1,2]
			// _.drop([1, 2, 3]); ==> [2,3]
			// _.drop([1, 2, 3],2); ==> [3]
			result = _.take(_.drop(result, pagenum * pagesize), pagesize)
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["categories"] = result;
			return cb(null, {
				msg: "商品分类：获取分类分页数据成功！",
				code: 200,
				data: resultDta
			});
		}
		cb(null, {
			msg: "商品分类：获取分类列表成功！",
			code: 200,
			data: result
		});
	});
}

/**
 * 获取具体分类对象
 * 
 * @param  {[type]}   id 分类ID
 * @param  {Function} cb 回调函数
 */
module.exports.getCategoryById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "商品分类：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("CategoryModel", id, function (err, category) {
		if (err) return cb({
			msg: "商品分类：获取失败！",
			code: 500,
			stack: err
		});
		if (!category) return cb({
			msg: "商品分类：分类不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "商品分类：获取成功！",
			code: 200,
			data: formatData(category)
		});
	});
}

/**
 * 根据条件获取分类数据
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb 回调函数
 */
 module.exports.getCategoryListByCondition = function (conditions = {}, cb) {
	dao.list("CategoryModel", { where: conditions }, function (err, categories) {
		if (err) return cb({
			msg: "商品分类获取：获取失败！",
			code: 500,
			stack: err
		});
		if(!categories) categories = [];
		categories = categories.map(formatData);
		var keyCategories = _.keyBy(categories, "id");
		cb(null, {
			msg: "商品分类获取：获取成功！",
			code: 200,
			data: getTreeResult(keyCategories, categories, 3)
		});
	});
}