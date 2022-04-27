var express = require('express');
var router = express.Router();
var path = require("path");
var comServ = require(path.join(process.cwd(), "/services/CommentService"));

/**
 * 【增】添加评论
 * this.$http.post('comment/insert',{
 *     order_id: "", user_id: "", content: "",
 *     overall_rating: "", good_rating: "", delivery_rating: "", service_rating: "", 
 *     pics:[
 *         {id:1,src:"http://...jpg"},
 *         {src:"tmp_uploads//...jpg"},
 *     ]
 * })
 */
router.post("/insert", function (req, res, next) {
	comServ.createComment({
		"order_id": req.body.order_id,
		"order_code": req.body.order_code,
		"good_id": req.body.good_id,
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
	});
});

/** 
 * 【改】追加图片
 * this.$http.put('comment/updatePics/' + item.id,{
 *     pics:[
 *         {src:"tmp_uploads//...jpg"},
 *     ]
 * })
 */
router.put("/updatePics/:id", function (req, res, next) {
	comServ.updateComment(req.params.id, {
		"pics": req.body.pics || []
	}, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

/** 
 * 【查】分页查询
 * this.$http({
 *		url:'comment/getPage', 
 *		method:'post',
 *		params: this.queryInfo,
 *		data:{ 搜索条件暂无 }
 * })
 */
router.post("/getPage", function (req, res, next) {
	var conditions = {
		"where": { 
			deleted: 1,
		},
		"pagenum": req.query.pagenum,
		"pagesize": req.query.pagesize
	}
	if (req.body.good_id) {
		conditions.where.good_id = req.body.good_id
	}
	if (req.body.user_id) {
		conditions.where.user_id = req.body.user_id
	}
	console.log(1111111111111111111111111111);
	console.log(global.database.sequelize.where(
		(
			global.database.sequelize.col('overall_rating')+
			global.database.sequelize.col('good_rating')+
			global.database.sequelize.col('delivery_rating')+
			global.database.sequelize.col('service_rating')
		)/4,
		">", 
		4.5
	));
	conditions.where[global.database.sequelize.col('overall_rating')+
	global.database.sequelize.col('good_rating')+
	global.database.sequelize.col('delivery_rating')+
	global.database.sequelize.col('service_rating')] = global.database.sequelize.where(
		(
			global.database.sequelize.col('overall_rating')+
			global.database.sequelize.col('good_rating')+
			global.database.sequelize.col('delivery_rating')+
			global.database.sequelize.col('service_rating')
		)/4, 
		4.5
	)
	comServ.getAllComments(conditions, function (err, result) {
		if (err) return res.sendResult(null, err.code, err.msg, err.stack);
		res.sendResult(result.data, result.code, result.msg, null);
	});
});

module.exports = router;``