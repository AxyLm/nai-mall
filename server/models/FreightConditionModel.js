module.exports = function (sequelize, Sequelize) {
	// 包邮条件模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("FreightConditionModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		freight_id: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				min: 0
			},
		},
		area_code: Sequelize.STRING(255),
		area_info: Sequelize.STRING(255),
		// 运送方式：快递-0，EMS-1，平邮-2
		delivery_way: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				isIn: [[0, 1, 2]],
			},
		},
		// 免邮条件：weight、piece、volume、money、weight-money、piece-money、volume-money
		condition: {
			type: Sequelize.STRING,
			validate: {
				isIn: [["weight", "piece", "volume", "money", "weight-money", "piece-money", "volume-money"]],
			},
		},
		piece_no: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				min: 0
			},
		},
		weight_no: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		volume_no: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		money: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
	}, {
		tableName: "freight_condition"
	});
}