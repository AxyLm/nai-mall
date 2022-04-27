module.exports = function (sequelize, Sequelize) {
	// 门店模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("ConfigStoreModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(100),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		area_code: {
			type: Sequelize.STRING(6),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		area_info: {
			type: Sequelize.STRING(255),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		street_info: {
			type: Sequelize.STRING(255),
			allowNull:false,
			validate: {
				notEmpty: true,
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
		tableName: "config_store"
	});
}