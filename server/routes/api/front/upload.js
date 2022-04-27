var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var multer = require("multer");
// 临时上传目录
var upload = multer({ dest: "tmp_uploads/" });
var upload_config = require("config").get("upload_config");
// 提供文件上传服务
router.post("/:type", upload.single("file"), function(req, res, next){
	if(!req.params.type) return res.sendResult(null, 400, "上传类型未携带",null);
	if(!["ueditor","manager","member","goodspics","commentpics","banner"].includes(req.params.type)) return res.sendResult(null, 400, "上传类型不正确",null);
	next();
}, function (req, res, next) {
	var fileExtArray = req.file.originalname.split(".");
	var ext = fileExtArray[fileExtArray.length - 1];
	// { fieldname: 'file',
	// originalname: 'd.jpg',
	// encoding: '7bit',
	// mimetype: 'image/jpeg',
	// destination: 'tmp_uploads/',
	// filename: '46c096633a81abebc252bed8f67e0812',
	// path: 'tmp_uploads\\46c096633a81abebc252bed8f67e0812',
	// size: 26251 }
	var targetPath = req.file.filename + "." + ext;
	if (req.params.type == "ueditor") {
		targetPath = upload_config.get("upload_ueditor") + "/" + targetPath;
	} else if (req.params.type == "manager") {
		targetPath = upload_config.get("upload_manager") + "/" + targetPath;
	} else{
		targetPath = req.file.destination + "/" + targetPath;
	}
	var oldPath = path.join(process.cwd(), "/" + req.file.path);
	var newPath = path.join(process.cwd(), targetPath);
	fs.rename(oldPath, newPath, function (err) {
		if (err) {
			return res.sendResult(null, 400, "上传文件失败",err);
		}
		res.sendResult({ "tmp_path": targetPath, "url": upload_config.get("baseURL") + "/" + targetPath }, 200, "上传成功",null);
	});
});
module.exports = router;