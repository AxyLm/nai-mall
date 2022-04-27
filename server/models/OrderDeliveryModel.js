module.exports = function (sequelize, Sequelize) {
	// 订单快递模型
	return sequelize.define("OrderDeliveryModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true
		},
		order_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		company: {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		number: {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		add_time: { 
			type: Sequelize.INTEGER, 
			defaultValue: Date.now() / 1000 
		},
		upd_time : Sequelize.INTEGER
	}, {
		tableName: "order_delivery"
	});
}