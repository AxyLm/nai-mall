module.exports.clearGoodAttributes = function (good_id, cb) {
	var sql = "DELETE FROM good_attr WHERE good_id = ?";
	database.sequelize.query(sql, {
		replacements: [good_id],
	})
	.then(_=>cb(null))
	.catch(err=>cb(err));
}

module.exports.list = function (good_id, cb) {
	var sql = "SELECT good_attr.id,good_attr.good_id,good_attr.attr_id,good_attr.value,good_attr.add_price,attr.name,attr.type,attr.write,attr.vals FROM good_attr as good_attr LEFT JOIN category_attr as attr ON attr.id = good_attr.attr_id WHERE good_attr.good_id = ?";
	database.sequelize.query(sql, {
		type: database.Sequelize.QueryTypes.SELECT,
		replacements: [good_id],
	})
	.then(attrs=>cb(null, attrs))
	.catch(err=>cb(err));
}