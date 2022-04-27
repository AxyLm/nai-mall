module.exports = function (sequelize, Sequelize) {
	// 订单商品模型
	return sequelize.define("OrderGoodModel",{
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		order_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		good_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		good_name : {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		good_price : {
			type: Sequelize.DECIMAL(10,2),
			allowNull: false
		},
		good_count : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		cat_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		cat_name: {
			type: Sequelize.STRING(32),
			allowNull: false
		}
	},{
		tableName : "order_good"
	});
}