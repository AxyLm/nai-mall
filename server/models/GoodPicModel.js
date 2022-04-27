module.exports = function (sequelize, Sequelize) {
	// 商品图片模型
	return sequelize.define("GoodPicModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		good_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		big : {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		mid : {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		sma : {
			type: Sequelize.STRING(255),
			allowNull: false
		}
	},{
		tableName : "good_pic"
	});
}