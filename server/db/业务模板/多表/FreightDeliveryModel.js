module.exports = function (sequelize, Sequelize) {
	// 运送方式模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("FreightDeliveryModel", {
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
		first_piece: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				min: 0
			},
		},
		first_weight: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		first_volume: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		first_money: {
			type: Sequelize.DECIMAL(18,2),
			allowNull: false,
			validate: {
				notNull: true,
				isDecimal: true,
				min: 0,
			},
		},
		second_piece: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				min: 0
			},
		},
		second_weight: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		second_volume: {
			type: Sequelize.DECIMAL(18,2),
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		second_money: {
			type: Sequelize.DECIMAL(18,2),
			allowNull: false,
			validate: {
				notNull: true,
				isDecimal: true,
				min: 0,
			},
		},
		// 运送方式：快递-0，EMS-1，平邮-2
		delivery_way: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				isIn: [[0, 1, 2]],
			},
		},
		// 是否默认：0-否 1-是
		is_default: { 
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				isIn: [[0, 1]],
			},
		},
	}, {
		tableName: "freight_delivery"
	});
}