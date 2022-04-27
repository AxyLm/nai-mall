module.exports.clear = function (freight_id, cb) {
	var sql = "DELETE FROM freight_condition WHERE freight_id = ?";
	database.sequelize.query(sql, {
		replacements: [freight_id],
	})
	.then(_=>cb(null))
	.catch(err=>cb(err));
}