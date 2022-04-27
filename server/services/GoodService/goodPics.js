var _ = require('lodash');
var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var fs = require("fs");
var gm = require("gm");
var upload_config = require('config').get("upload_config");

/**
 * 删除商品图片文件
 * 
 * @param  {[type]} path 图片路径
 * @return {[type]}      [description]
 */
function removeGoodPicFile(path) {
    return new Promise(function (resolve, reject) {
        fs.unlink(path, function (err, result) {
            if (err) return reject({
                msg: "商品管理：移除商品图片文件失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}
/**
 * 删除商品图片记录
 * 
 * @param  {[type]} pic 图片对象
 * @return {[type]}     [description]
 */
function removeGoodPic(pic) {
    return new Promise(function (resolve, reject) {
        if (!pic || !pic.destroy) return reject({
            msg: "商品管理：移除商品图片记录失败！",
            code: 500,
            stack: null
        });
        pic.destroy()
            .then(_ => resolve())
            .catch(err => reject({
                msg: "商品管理：移除商品图片记录失败！",
                code: 500,
                stack: err
            }));
    });
}

/**
 * 裁剪图片
 * 
 * @param  {[type]} srcPath   原始图片路径
 * @param  {[type]} savePath  存储路径
 * @param  {[type]} newWidth  新的宽度
 * @param  {[type]} newHeight 新的高度
 * @return {[type]}           [description]
 */
function clipImage(srcPath, savePath, newWidth, newHeight) {
    return new Promise(function (resolve, reject) {
        // 创建读写流
        // var readable = fs.createReadStream(srcPath);
        // var writable = fs.createWriteStream(savePath);
        // readable.pipe(writable);
        // readable.on('end',function() {
        // 	resolve();
        // });
        // 使用gm裁剪图片
        gm(srcPath).resize(newWidth, newHeight).autoOrient().write(savePath, function (err) {
            if (err) return reject({
                msg: "商品管理：商品图片裁剪失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}

/**
 * 创建商品图片
 * 
 * @param  {[type]} pic 图片对象
 * @return {[type]}     [description]
 */
function createGoodPic(pic) {
    return new Promise(function (resolve, reject) {
        if (!pic) return reject({
            msg: "商品管理：商品图片对象不存在！",
            code: 400,
            stack: null
        });
        dao.create("GoodPicModel", pic, function (err, newPic) {
            if (err) return reject({
                msg: "商品管理：商品图片保存到数据库失败！",
                code: 500,
                stack: err
            });
            resolve();
        });
    });
}

module.exports.removeGoodPicFile = removeGoodPicFile;

/**
 * 更新商品图片
 * 
 * @param  {[type]} info    参数
 * @param  {[type]} newGood 商品基本信息
 */
module.exports.doUpdateGoodPics = function (info) {
    return new Promise(function (resolve, reject) {
        var good = info.good;
        if (!good.id) return reject({
            msg: "商品管理：更新商品图片失败，商品id不存在！",
            code: 400,
            stack: null
        });
        if (!info.pics) return resolve(info);
        dao.list("GoodPicModel", {
            "where": { "good_id": good.id }
        }, function (err, oldpics) {
            console.log(err);
            if (err) return reject({
                msg: "商品管理：获取商品图片列表失败！",
                code: 500,
                stack: err
            });
            var batchFns = [];
            var newpics = info.pics ? info.pics : [];
            var newpicsKV = _.keyBy(newpics, "id");
            /**
             * 保存图片集合
             */
            // 需要新建的图片集合
            var addNewpics = [];
            // 需要保留的图片的集合
            var reservedOldpics = [];
            // 需要删除的图片集合
            var delOldpics = [];
            // 如果提交的新的数据中有老的数据的id就说明保留数据，否则就删除
            _(oldpics).forEach(function (pic) {
                if (newpicsKV[pic.id]) {
                    reservedOldpics.push(pic);
                } else {
                    delOldpics.push(pic);
                }
            });
            // 从新提交的数据中检索出需要新创建的数据
            // 计算逻辑如果提交的数据不存在 id 字段说明是新创建的数据
            _(newpics).forEach(function (pic) {
                if (!pic.id && pic.pic) {
                    addNewpics.push(pic);
                }
            });
            // 开始处理商品图片数据逻辑
            // 1. 删除商品图片数据集合
            _(delOldpics).forEach(function (pic) {
                // 1.1 删除图片物理路径
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.big)));
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.mid)));
                batchFns.push(removeGoodPicFile(path.join(process.cwd(), pic.sma)));
                // 1.2 数据库中删除图片数据记录
                batchFns.push(removeGoodPic(pic));
            });

            // 2. 处理新建图片的集合
            _(addNewpics).forEach(function (pic) {
                if (!pic.id && pic.pic) {
                    // 2.1 通过原始图片路径裁剪出需要的图片
                    var src = path.join(process.cwd(), pic.pic);
                    var tmp = src.split(path.sep);
                    var filename = tmp[tmp.length - 1];
                    pic.big = "/uploads/goodspics/big_" + filename;
                    pic.mid = "/uploads/goodspics/mid_" + filename;
                    pic.sma = "/uploads/goodspics/sma_" + filename;
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.big), 800, 800));
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.mid), 400, 400));
                    batchFns.push(clipImage(src, path.join(process.cwd(), pic.sma), 200, 200));
                    pic.good_id = good.id;
                    // 2.2 数据库中新建数据记录
                    batchFns.push(createGoodPic(pic));
                }
            });
            // 如果没有任何图片操作就返回
            if (batchFns.length == 0) {
                return resolve(info);
            }
            // 批量执行所有操作
            Promise.all(batchFns).then(function () {
                resolve(info);
            }).catch(function (err) {
                if (err) return reject(err);
            });
        });
    });
}

/**
 * 挂载图片
 * 
 * @param  {[type]} info [description]
 * @return {[type]}      [description]
 */
module.exports.doGetAllPics = function (info) {
    return new Promise(function (resolve, reject) {
        var good = info.good;
        if (!good.id) return reject({
            msg: "商品管理：获取商品图片失败，商品id不存在！",
            code: 400,
            stack: null
        });
        dao.list("GoodPicModel", { "where": { "good_id": good.id } }, function (err, goodPics) {
            if (err) return reject({
                msg: "商品管理：获取商品图片失败！",
                code: 500,
                stack: err
            });
            goodPics = goodPics.map(function (pic) {
                let tmp = {
                    id: pic.id
                };
                if (pic.big.indexOf("http") == 0) {
                    tmp.big_url = pic.big;
                } else {
                    tmp.big_url = upload_config.get("baseURL") + pic.big;
                }
                if (pic.mid.indexOf("http") == 0) {
                    tmp.mid_url = pic.mid;
                } else {
                    tmp.mid_url = upload_config.get("baseURL") + pic.mid;
                }
                if (pic.sma.indexOf("http") == 0) {
                    tmp.sma_url = pic.sma;
                } else {
                    tmp.sma_url = upload_config.get("baseURL") + pic.sma;
                }
                return tmp;
            });
            info.good.pics = goodPics;
            resolve(info);
        });
    });
}