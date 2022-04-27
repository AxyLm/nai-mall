module.exports = function (sequelize, Sequelize) {
	// 焦点图模型
	return sequelize.define("BannerModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true
		},
		img_url: {
			type: Sequelize.STRING(255),
			allowNull: false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		target: {
			type: Sequelize.STRING(255),
			allowNull: false,
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
		desc: Sequelize.STRING(255),
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
			defaultValue: Date.now() / 1000 
		},
		upd_time : Sequelize.INTEGER
	}, {
		tableName: "banner"
	});
}