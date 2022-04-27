module.exports = function (sequelize, Sequelize) {
	// 评价图片模型
	return sequelize.define("CommentPicModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		comment_id: {
			type: Sequelize.INTEGER,
			allowNull:false,
			validate: {
				isInt: true,
				notNull: true
			},
		},
		src: {
			type: Sequelize.STRING(255),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
	}, {
		tableName: "comment_pic"
	});
}