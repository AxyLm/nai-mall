var _ = require('lodash');
var path = require("path");
var fs = require("fs");
var gm = require("gm");
var dao = require(path.join(process.cwd(), "dao/DAO"));
var upload_config = require('config').get("upload_config");

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
		"pics": data.pics || [],
		"deleted": data.deleted==1,
		"add_time": data.add_time,
		"upd_time": data.upd_time
	}
}

/**
 * 更新评价图片
 * 
 * @param  {[type]} comment 评价对象
 * @param  {[type]} pics    图片数组
 */
function doUpdatePics(comment,pics=[]) {
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

function removePicFile(path) {
	console.log(path);
    return new Promise(function (resolve, reject) {
        fs.unlink(path, function (err) {
            if(err) return reject({
                msg: "移除评价图片文件失败！",
			    code: 500,
			    stack: err
            });
            resolve();
        });
    });
}

function removePic(pic) {
    return new Promise(function (resolve, reject) {
        pic.destroy()
        .then(_=>resolve())
        .catch(err=>reject({
            msg: "移除评价图片记录失败！",
            code: 500,
            stack: err
        }));
    });
}

function clipImage(srcPath, savePath, newWidth, newHeight) {
    return new Promise(function (resolve, reject) {
        gm(srcPath).resize(newWidth, newHeight).autoOrient().write(savePath, function (err) {
            if(err) return reject({
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
 * 挂载图片
 * 
 * @param  {[type]} comment [评价对象]
 */
function doGetAllPics(comment) {
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
		doUpdatePics(comment,params.pics)
		.then(doGetAllPics)
		.then(newComment => cb(null, {
			msg: "添加评价：添加成功！",
			code: 201,
			data: formatData(newComment)
		}))
		.catch(cb);
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
	dao.list("CommentPicModel",{where:{comment_id:id}},function (err,commentpics) {
        if (err) return cb({
			msg: "删除评价：删除失败，查询评价图片出错！",
			code: 500,
			stack: err
		});
        commentpics = commentpics || [];
        var batchFns = [];
        commentpics.map(function (it) {
            batchFns.push(removePicFile(path.join(process.cwd(),it.src)));
			batchFns.push(removePic(it));
        });
        Promise.all(batchFns).then(function () {
            dao.destroyMany("CommentModel", id, function (err) {
                if (err) return cb({
                    msg: "删除评价：删除出错！",
                    code: 500,
                    stack: err
                });
                cb(null,{
                    msg: "删除评价：删除成功！",
                    code: 200,
                    data: null
                });
            });
        }).catch(cb);
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
		doUpdatePics(comment,data.pics)
		.then(doGetAllPics)
		.then(newComment => cb(null, {
			msg: "更新评价：更新成功！",
			code: 200,
			data: formatData(newComment)
		}))
		.catch(cb);
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
		doGetAllPics(comment).
		then(newComment=>cb(null, {
			msg: "获取评价对象：获取成功！",
			code: 200,
			data: formatData(newComment)
		}))
		.catch(cb);
	});
}