var path = require("path");
var fs = require("fs");
var gm = require("gm");
// 移除旧的轮播图文件
module.exports.doRemoveOldBannerFile = function (info) {
	return new Promise(function (resolve, reject) {
		fs.unlink(info.oldPath, function (err, result) {
			if (err) return reject({
				msg: "轮播图：移除轮播图文件失败！",
				code: 500,
				stack: err
			});
			resolve(info);
		});
	})
}
// 添加新上传的轮播图文件
module.exports.doSaveNewBannerFile = function (info) {
	return new Promise(function (resolve, reject) {
		var filename = path.basename(info.data.img_url);
		var srcPath = path.join(process.cwd(), info.data.img_url);
		var savePath = path.join(process.cwd(), "/uploads/banner/" + filename);
		gm(srcPath).resize(800, 800).autoOrient().write(savePath, function (err) {
			if (err) return reject({
				msg: "轮播图：新轮播图片裁剪失败！",
				code: 500,
				stack: err
			});
			info.data.img_url = "/uploads/banner/" + filename;
			resolve(info);
		});
	});
}