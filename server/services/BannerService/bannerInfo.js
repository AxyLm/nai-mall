var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
// 更新轮播图记录
module.exports.doUpdateBanner = function (info) {
	return new Promise(function (resolve, reject) {
		dao.update("BannerModel", info.id, info.data, function (err, banner) {
			if (err) return reject({
				msg: "轮播图：更新失败！",
				code: 500,
				stack: err
			});
			resolve(banner);
		});
	})
}

// 创建新轮播图记录
module.exports.doCreateBanner = function (info) {
	return new Promise(function (resolve, reject) {
		dao.create("BannerModel", info.data, function (err, banner) {
			if (err) return reject({
				msg: "轮播图：创建失败！",
				code: 500,
				stack: err
			});
			resolve(banner);
		});
	});
}