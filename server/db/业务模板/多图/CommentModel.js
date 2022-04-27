module.exports = function (sequelize, Sequelize) {
	// 评价模型：验证会自动在 create, update 和 save 时运行
	return sequelize.define("CommentModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		order_id: {
			type: Sequelize.INTEGER,
			allowNull:false,
			validate: {
				isInt: true,
				notNull: true
			},
		},
		order_code: {
			type: Sequelize.STRING(32),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull:false,
			validate: {
				isInt: true,
				notNull: true
			},
		},
		user_name: {
			type: Sequelize.STRING(32),
			allowNull:false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		content: { 
			type:Sequelize.TEXT,
			allowNull:false,
			validate: {
				notNull: true
			},
		},
		overall_rating: {
			type: Sequelize.FLOAT,
			allowNull:false,
			validate: {
				isDecimal: true,
				min: 0,
				max: 5,
				notNull: true
			},
		},
		good_rating: {
			type: Sequelize.FLOAT,
			allowNull:false,
			validate: {
				isDecimal: true,
				min: 0,
				max: 5,
				notNull: true
			},
		},
		delivery_rating: {
			type: Sequelize.FLOAT,
			allowNull:false,
			validate: {
				isDecimal: true,
				min: 0,
				max: 5,
				notNull: true
			},
		},
		service_rating: {
			type: Sequelize.FLOAT,
			allowNull:false,
			validate: {
				isDecimal: true,
				min: 0,
				max: 5,
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
		tableName: "comment"
	});
}