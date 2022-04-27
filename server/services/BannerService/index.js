var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var url = require("url");

var formatData = require("./formatData.js");
var { doRemoveOldBannerFile, doSaveNewBannerFile } = require("./bannerPics.js");
var { doCreateBanner, doUpdateBanner } = require("./bannerInfo.js");

/**
 * 添加轮播图
 * 
 * @param {[type]}   params 轮播图数据 
 * @param {Function} cb  回调函数
 */
module.exports.createBanner = function (params, cb) {
	if (!params.img_url) {
		return cb({
			msg: "轮播图：图片地址不存在！",
			code: 400,
			stack: null
		});
	} else {
		params.img_url = url.parse(params.img_url).pathname
	}
	if (!params.target) {
		return cb({
			msg: "轮播图：跳转地址不存在！",
			code: 400,
			stack: null
		});
	}
	if (isNaN(params.sort)) {
		return cb({
			msg: "轮播图：序号不合法！",
			code: 400,
			stack: null
		});
	}
	doSaveNewBannerFile({
		data: params
	})
		.then(doCreateBanner)
		.then(function (banner) {
			cb(null, {
				msg: "轮播图：创建成功！",
				code: 201,
				data: formatData(banner)
			});
		})
		.catch(cb);
}

/**
 * 删除轮播图
 * 
 * @param  {[type]}   id     轮播图ID
 * @param  {Function} cb     回调函数
 */
module.exports.deleteBanner = function (id, cb) {
	if (!id) return cb({
		msg: "轮播图：ID不能为空！",
		code: 400,
		stack: null
	});
	if (!Array.isArray(id)) id = [id];
	if (id.every(item => isNaN(parseInt(item)))) return cb({
		msg: "轮播图：ID必须是数字！",
		code: 400,
		stack: null
	});
	dao.list('BannerModel', { where: { id: id }, attributes: ['img_url'] }, function (err, bans) {
		if (err) return cb({
			msg: "轮播图：删除失败，查询数据出差！",
			code: 500,
			stack: err
		});
		bans = bans || [];
		var batchFns = [];
		bans.map(function (it) {
			batchFns.push(doRemoveOldBannerFile({
				oldPath: path.join(process.cwd(), it.img_url)
			}))
		});
		Promise.all(batchFns).then(function () {
			dao.destroyMany("BannerModel", id, function (err) {
				if (err) return cb({
					msg: "轮播图：删除失败！",
					code: 500,
					stack: err
				});
				cb(null, {
					msg: "轮播图：删除成功！",
					code: 200,
					data: null
				});
			});
		}).catch(cb);
	})
}

/**
 * 更新轮播图
 * 
 * @param  {[type]}   id   轮播图ID
 * @param  {[type]}   data 新数据
 * @param  {Function} cb   回调函数
 */
module.exports.updateBanner = function (id, data, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "轮播图：ID不合法！",
		code: 400,
		stack: null
	});
	if (!data.img_url) {
		delete data.img_url
	} else {
		data.img_url = url.parse(data.img_url).pathname;
	};
	if (!data.target) delete data.target;
	if (!data.sort) data.sort = 0;
	dao.findByID("BannerModel", id, function (err, banner) {
		if (err || !banner) return cb({
			msg: "轮播图：更新失败，查询数据出差！",
			code: 500,
			stack: err
		});
		// 说明上传了新的轮播图
		if (banner.img_url != data.img_url) {
			var oldPath = path.join(process.cwd(), banner.img_url);
			// 移除旧文件
			doRemoveOldBannerFile({
				oldPath: oldPath,
				id: id,
				data: data
			})
				// 存储新文件
				.then(doSaveNewBannerFile)
				// 更新数据库
				.then(doUpdateBanner)
				.then(function (banner) {
					cb(null, {
						msg: "轮播图：更新成功！",
						code: 200,
						data: formatData(banner)
					});
				})
				.catch(cb);
		} else {
			doUpdateBanner({
				id: id, data: data
			})
				.then(function (banner) {
					cb(null, {
						msg: "轮播图：更新成功！",
						code: 200,
						data: formatData(banner)
					});
				})
				.catch(cb);
		}

	});
}

/**
 * 修改轮播图删除状态
 * 
 * @param  {[type]}   id      轮播图ID
 * @param  {[type]}   deleted 0未删除 1已删除
 * @param  {Function} cb      回调函数
 */
module.exports.updateBannerDeleted = function (id, deleted, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "轮播图：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("BannerModel", id, function (err, banner) {
		if (err) return cb({
			msg: "轮播图：获取失败！",
			code: 500,
			stack: err
		});
		if (!banner) return cb({
			msg: "轮播图：不存在！",
			code: 403,
			stack: null
		});
		dao.update("BannerModel", banner.id, { "deleted": deleted }, function (err, banner) {
			if (err) return cb({
				msg: "轮播图：设置状态失败！",
				code: 500,
				stack: err
			});
			cb(null, {
				msg: "轮播图：设置状态成功！",
				code: 200,
				data: formatData(banner)
			});
		});
	});
}

/**
 * 根据条件获取焦点图列表
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
module.exports.getAllBanners = function (conditions, cb) {
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
	dao.countByConditions("BannerModel", conditions, function (err, count) {
		if (err) return cb({
			msg: "轮播图：获取总数失败！",
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
		dao.list("BannerModel", {
			offset: offset,
			limit: limit,
			where: conditions["where"],
			order: conditions["order"] || "-sort"
		}, function (err, banner) {
			if (err) return cb({
				msg: "轮播图：获取分页数据失败！",
				code: 500,
				stack: err
			});
			var resultDta = {};
			resultDta["total"] = count;
			resultDta["pagenum"] = pagenum;
			resultDta["banner"] = banner.map(formatData);
			cb(null, {
				msg: "轮播图：获取分页数据成功！",
				code: 200,
				data: resultDta
			});
		});
	});
}

/**
 * 根据id获取轮播图对象
 * 
 * @param  {[type]}   id 轮播图ID
 * @param  {Function} cb 回调函数
 */
module.exports.getBannerById = function (id, cb) {
	if (!id || isNaN(parseInt(id))) return cb({
		msg: "轮播图：ID不合法！",
		code: 400,
		stack: null
	});
	dao.findByID("BannerModel", id, function (err, banner) {
		if (err) return cb({
			msg: "轮播图：获取失败！",
			code: 500,
			stack: err
		});
		if (!banner) return cb({
			msg: "轮播图：不存在！",
			code: 403,
			stack: null
		});
		cb(null, {
			msg: "轮播图：获取成功！",
			code: 200,
			data: formatData(banner)
		});
	});
}

/**
 * 根据条件获取轮播图对象
 * 
 * @param  {[type]}   conditions 查询条件
 * @param  {Function} cb 回调函数
 */
module.exports.getBannerListByCondition = function (conditions = {}, cb) {
	dao.list("BannerModel", { where: conditions }, function (err, banners) {
		if (err) return cb({
			msg: "轮播图：获取失败！",
			code: 500,
			stack: err
		});
		if (!banners) banners = [];
		cb(null, {
			msg: "轮播图：获取成功！",
			code: 200,
			data: banners.map(formatData)
		});
	});
}