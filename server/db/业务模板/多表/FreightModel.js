module.exports = function (sequelize, Sequelize) {
	// 运费模板模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("FreightModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		delivery_time: {
			type: Sequelize.STRING(4),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		good_addr_code: {
			type: Sequelize.STRING(6),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		good_addr_info: {
			type: Sequelize.STRING(255),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		// 是否包邮：0-自定义运费 1-包邮
		is_free: {
			type: Sequelize.INTEGER,
			allowNull:false,
			validate: {
				isInt: true,
				notNull: true,
				isIn: [[0, 1]],
			},
		},
		// 计价方式：0-按重量 1-按件数 2-按体积
		price_method: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				isIn: [[0, 1, 2]],
			},
		},
		// 是否指定包邮条件：0-否 1-是
		specify_free_condition: {
			type: Sequelize.INTEGER,
			validate: {
				isInt: true,
				isIn: [[0, 1]],
			},
			set(value) {
				var code = 0;
				if(value && String(value)=="true") code = 1;
				this.setDataValue('specify_free_condition', code);
			}
		},
		deleted: {
			type:Sequelize.INTEGER,
			validate: {
				isIn: [[0, 1]],
			},
			set(value) {
				var delNum = 0;
				if(value && String(value)=="true") delNum = 1;
				this.setDataValue('deleted', delNum);
			}
		},
		add_time: { 
			type: Sequelize.INTEGER, 
			defaultValue: parseInt(Date.now() / 1000) 
		},
		upd_time : Sequelize.INTEGER
	}, {
		tableName: "freight"
	});
}