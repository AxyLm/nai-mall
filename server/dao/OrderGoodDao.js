/**
 * 获取订单商品列表数据
 * 
 * @param  {[type]}   order_id  分类ID
 * @param  {Function} cb     回调函数
 */
 module.exports.list = function (order_id, cb) {
	var sql = (
		`SELECT
			og.id, og.order_id, og.good_id, og.good_name, og.good_price, og.good_count,og.cat_id,og.cat_name,
			GROUP_CONCAT(gp.big) big_imgs,GROUP_CONCAT(gp.mid) mid_imgs,GROUP_CONCAT(gp.sma) sma_imgs
		FROM
			order_good AS og
		LEFT OUTER JOIN
			good_pic AS gp
		ON
			og.good_id = gp.good_id
		WHERE
			order_id = ?
		GROUP BY og.good_price`
	);
	database.sequelize.query(sql, {
		type: database.Sequelize.QueryTypes.SELECT,
		replacements:[order_id]
	})
	.then(data=>cb(null,data))
	.catch(err=>cb(err,null));
}