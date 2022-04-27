module.exports = function (sequelize, Sequelize) {
	// 支付方式模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("ConfigPayModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(32),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		sort: {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
				notNull: true
			},
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
		tableName: "config_pay"
	});
}