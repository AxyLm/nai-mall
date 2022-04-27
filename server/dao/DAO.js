var path = require("path");
var databaseModule = require(path.join(process.cwd(), "modules/database"));
var _ = require("lodash");

/**
 * 根据模型名称获取模型类
 * 
 * @param  {[type]}   modelName 模型名称
 */
function getModel(modelName) {
	var db = databaseModule.getDatabase();
	var Model = db.models[modelName];
	if (!Model) return {
		isError: true,
		info: {
			msg: "模型不存在",
			code: 500,
			stack: null
		}
	};
	return Model;
}

/**
 * 根据传过来的排序字段，生成排序条件
 * 
 * @param  {[type]}  data 排序字段
 */
function genOrder(data) {
		var res = [];
		// 多字段筛选
		if (!Array.isArray(data)) data = [data];
		res = data.map(function (it) {
			var is_sub_query = typeof it == "object";
			var od_col = is_sub_query ? it.sub : it;
			var od_way = "ASC"
			if (od_col.startsWith("-")) {
				od_col = od_col.substring("1");
				od_way = "DESC";
			}
			return [
				is_sub_query ? global.database.sequelize.literal(od_col) : od_col,
				od_way
			]
		});
		return res;
}

/**
 * 根据数据对象创建数据表记录
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   obj       数据对象
 * @param  {Function} cb        回调函数
 */
module.exports.create = function (modelName, obj, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	Model.create(obj)
		.then(data => cb(null, data))
		.catch(err => cb(err, null));
}

/**
 * 根据条件获取数据列表
 * 
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"where" : {
			字段条件
			"字段名" : "条件值"
		},
		"offset" : "偏移",
		"limit" : "",
		"attributes" : ["需要字段"],
		"order" :[ 
			["字段" , A | Z]
			...
		]
	}
 * @param  {Function} cb         回调函数
 */
module.exports.list = function (modelName, conditions, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	var finalTerms = {
		// raw: true
	};
	if (conditions) {
		conditions["where"] && (finalTerms.where = conditions["where"]);
		conditions["offset"] && (finalTerms.offset = conditions["offset"]);
		conditions["limit"] && (finalTerms.limit = conditions["limit"]);
		conditions["attributes"] && (finalTerms.attributes = conditions["attributes"]);
		conditions["order"] && (finalTerms.order = genOrder(conditions["order"]));

	}
	Model.findAll(finalTerms)
		.then(data => cb(null, data))
		.catch(err => cb(err, null));
};

/**
 * 根据条件获取数据数量
 * 
 * @param  {[type]}   conditions 查询条件
 * 查询条件统一规范
 * conditions
	{
		"columns" : {
			字段条件
			"字段名" : "条件值"
		},
	}
 * @param  {Function} cb         回调函数
 */
module.exports.countByConditions = function (modelName, conditions, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	var finalTerms = {};
	if (conditions && conditions["where"]) {
		finalTerms.where = conditions["where"];
	}
	Model.count(finalTerms)
		.then(data => cb(null, data))
		.catch(err => cb(err, null));
};

/**
 * 根据条件获取一条数据
 * 
 * @param  {[type]}   modelName  模型名称
 * @param  {[数组]}   conditions  条件集合
 * @param  {Function} cb         回调函数
 */
module.exports.findOne = function (modelName, conditions, cb) {
	var Model = getModel(modelName),temp={};
	if (Model.isError) return cb(Model.info);
	if(conditions.attributes){
		temp.attributes = conditions.attributes;
		delete conditions.attributes;
	}
	temp.where = conditions;
	Model.findOne(temp)
	.then(data => cb(null, data))
	.catch(err => cb(err, null));
}

/**
 * 根据主键ID获取一条数据
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   id        主键ID
 * @param  {Function} cb        回调函数
 */
module.exports.findByID = function (modelName, id, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	Model.findOne({ where: { id } })
		.then(data => cb(null, data))
		.catch(err => cb(err, null));
}

/**
 * 更新对象数据
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   id        数据关键ID
 * @param  {[type]}   updateObj 更新对象数据
 * @param  {Function} cb        回调函数
 */
module.exports.update = function (modelName, id, updateObj, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	Model.findOne({ where: { id } })
		.then(data => {
			for (let key in updateObj) {
				data[key] = updateObj[key]
			}
			return data.save();
		})
		.then(data => cb(null, data))
		.catch(err => cb(err, null));
}

/**
 * 通过主键ID删除对象
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   id        主键ID
 * @param  {Function} cb        回调函数
 */
module.exports.destroy = function (modelName, id, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	Model.findOne({ where: { id } })
		.then(data => data.destroy())
		.then(_ => cb(null, null))
		.catch(err => cb(err, null));
}

/**
 * 通过主键ID批量删除对象
 * 
 * @param  {[type]}   modelName 模型名称
 * @param  {[type]}   idArr     主键ID数组
 * @param  {Function} cb        回调函数
 */
module.exports.destroyMany = function (modelName, idArr, cb) {
	var Model = getModel(modelName);
	if (Model.isError) return cb(Model.info);
	Model.destroy({ where: { "id": idArr } })
		.then(_ => cb(null, null))
		.catch(err => {
			console.log(err);
			cb(err, null)
		});
}