var _ = require('lodash');
var fs = require("fs");
var gm = require("gm");
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var upload_config = require('config').get("upload_config");

/**
 * 更新评价图片
 * 
 * @param  {[type]} comment 评价对象
 * @param  {[type]} pics    图片数组
 */
module.exports.doUpdatePics = function (comment, pics = []) {
    return new Promise(function (resolve, reject) {
        if (!comment.id) return reject({
            msg: "更新评价图片失败，评价id不存在！",
            code: 400,
            stack: null
        });
        if (!pics || !Array.isArray(pics) || !pics.length) return resolve(comment);
        dao.list("CommentPicModel", {
            "where": { "comment_id": comment.id }
        }, function (err, oldpics) {
            if (err) return reject({
                msg: "获取评价图片失败！",
                code: 500,
                stack: err
            });
            var batchFns = [];
            var newpics = pics ? pics : [];
            var newpicsKV = _.keyBy(newpics, "id");
            // 需要新建的图片集合
            var addNewpics = [];
            // 需要保留的图片的集合
            var reservedOldpics = [];
            // 需要删除的图片集合
            var delOldpics = [];
            _(oldpics).forEach(function (pic) {
                if (newpicsKV[pic.id]) {
                    reservedOldpics.push(pic);
                } else {
                    delOldpics.push(pic);
                }
            });
            _(newpics).forEach(function (pic) {
                if (!pic.id && pic.src) {
                    addNewpics.push(pic);
                }
            });
            // 开始处理商品图片数据逻辑
            // 1. 删除商品图片数据集合
            _(delOldpics).forEach(function (pic) {
                // 1.1 删除图片物理路径
                batchFns.push(removePicFile(path.join(process.cwd(), pic.src)));
                // 1.2 数据库中删除图片数据记录
                batchFns.push(removePic(pic));
            });

            // 2. 处理新建图片的集合
            _(addNewpics).forEach(function (pic) {
                pic.comment_id = comment.id;
                // 2.1 通过原始图片路径裁剪出需要的图片
                var src = path.join(process.cwd(), pic.src);
                var tmp = src.split(path.sep);
                var filename = tmp[tmp.length - 1];
                pic.src = "/uploads/commentpics/" + filename;
                batchFns.push(clipImage(src, path.join(process.cwd(), pic.src), 800, 800));
                // 2.2 数据库中新建数据记录
                batchFns.push(createPic(pic));
            });
            // 如果没有任何图片操作就返回
            if (batchFns.length == 0) {
                return resolve(comment);
            }
            // 批量执行所有操作
            Promise.all(batchFns).then(function () {
                resolve(comment);
            }).catch(function (err) {
                if (err) return reject(err);
            });
        });
    });
}

function clipImage(srcPath, savePath, newWidth, newHeight) {
    return new Promise(function (resolve, reject) {
        gm(srcPath).resize(newWidth, newHeight).autoOrient().write(savePath, function (err) {
            if (err) return reject({
                msg: "评价图片裁剪失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}

function createPic(pic) {
    return new Promise(function (resolve, reject) {
        dao.create("CommentPicModel", pic, function (err) {
            if (err) return reject({
                msg: "评价图片保存到数据库失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}

/**
 * 移除图片文件
 * 
 * @param  {[type]} path 图片硬盘路径
 */
module.exports.removePicFile = function (path) {
    return new Promise(function (resolve, reject) {
        fs.unlink(path, function (err) {
            if (err) return reject({
                msg: "移除评价图片文件失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}

/**
 * 移除图片记录
 * 
 * @param  {[type]} pic 图片记录sequelize实例
 */
module.exports.removePic = function (pic) {
    return new Promise(function (resolve, reject) {
        pic.destroy()
            .then(_ => resolve())
            .catch(err => reject({
                msg: "移除评价图片记录失败！",
                code: 500,
                stack: err
            }));
    });
}

/**
 * 挂载图片
 * 
 * @param  {[type]} comment [评价对象]
 */
module.exports.doGetAllPics = function (comment) {
    return new Promise(function (resolve, reject) {
        if (!comment.id) return reject({
            msg: "获取评价图片失败，商品id不存在！",
            code: 400,
            stack: null
        });
        dao.list("CommentPicModel", { "where": { "comment_id": comment.id } }, function (err, commentPics) {
            if (err) return reject({
                msg: "获取评价图片失败！",
                code: 500,
                stack: err
            });
            commentPics = commentPics.map(function (pic) {
                let tmp = {
                    id: pic.id
                };
                if (pic.src.indexOf("http") == 0) {
                    tmp.src = pic.src;
                } else {
                    tmp.src = upload_config.get("baseURL") + pic.src;
                }
                return tmp;
            });
            comment.pics = commentPics;
            resolve(comment);
        });
    });
}
