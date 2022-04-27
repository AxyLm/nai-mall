module.exports = function (data) {
	return {
		"id": data.id,
		"order_id": data.order_id,
		"order_code": data.order_code,
		"good_id": data.good_id,
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