var express = require('express');
var router = express.Router();
var path = require("path");

// 获取验证模块
var authorization = require(path.join(process.cwd(), "/modules/authorization"));
var comServ = authorization.getService("CommentService");

/**
 * 【增】单个添加评论
 * this.$http.post('comment/insert',{
 *     order_id: "", order_code:"", user_id: "", user_name:"", content: "",
 *     overall_rating: "", good_rating: "", delivery_rating: "", service_rating: "", 
 *     pics:[
 *         {id:1,src:"http://...jpg"},
 *         {src:"tmp_uploads//...jpg"},
 *     ]
 * })
 * 
 */
router.post("/insert", function (req, res, next) {
	comServ.createComment({
		"order_id": req.body.order_id,
		"order_code": req.body.order_code,
		"user_id": req.body.user_id,
		"user_name": req.body.user_name,
		"content": req.body.content,
		"overall_rating": req.body.overall_rating,
		"good_rating": req.body.good_rating,
		"delivery_rating": req.body.delivery_rating,
		"service_rating": req.body.service_rating,
		"pics": req.body.pics || [],
		"deleted": 1
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】单个物理删除
 * this.$http.delete('comment/delete/12')
 */
router.delete("/delete/:id", function (req, res, next) {
	comServ.deleteComment(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【删】批量物理删除
 * this.$http({
 *     method:'delete',
 *     url:'comment/batchDelete',
 * 	   data:{
 * 		 ids:[]
 * 	   }
 * })
 */
 router.delete("/batchDelete", function (req, res, next) {
	comServ.deleteComment(req.body.ids, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】编辑评论
 * this.$http.put('comment/update/' + item.id,{
 *     order_id: "", order_code:"", user_id: "", user_name:"", content: "",
 *     overall_rating: "", good_rating: "", delivery_rating: "", service_rating: "", 
 *     pics:[
 *         {id:1,src:"http://...jpg"},
 *         {src:"tmp_uploads//...jpg"},
 *     ]
 * })
 */
router.put("/update/:id", function (req, res, next) {
	comServ.updateComment(req.params.id, req.body, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【改】修改评论删除状态
 * this.$http.put('comment/updateDeleted/23',{
 *     deleted:true
 * })
 */
router.put("/updateDeleted/:id", function (req, res, next) {
	comServ.updateCommentDeleted(req.params.id, req.body.deleted, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'comment/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{
 *			id:this.filterData.id,
 *          deleted: 0,
 *          order: '-sort',
 *		}
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": { },
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	}
	if(req.body.search_input){
		conditions.where.$or = [
			{
				id:{
					$like: "%" + req.body.search_input + "%"
				}
			},
			{
				order_code:{
					$like: "%" + req.body.search_input + "%"
				}
			}
		]
	}
	if (req.body.deleted) {
		conditions.where.deleted = req.body.deleted;
	}
	if (req.body.order) {
		conditions.order = req.body.order
	}
	if (req.body.add_time && Array.isArray(req.body.add_time)) {
		let dateRange = req.body.add_time.map(it=>{
			return Date.parse(new Date(it)) / 1000;
		});
		conditions.where.add_time = {
			$between: dateRange
		};
	}
	comServ.getAllComments(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

/** 
 * 【查】根据 ID 查询
 * this.$http.get('comment/getByID/' + item.id)
 */
router.get("/getByID/:id", function (req, res, next) {
	comServ.getCommentById(req.params.id, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	})(req, res, next);
});

module.exports = router;