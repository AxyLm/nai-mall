module.exports = function (sequelize, Sequelize) {
	// 注册会员模型
	return sequelize.define("MemberModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true
		},
		telephone: {
			type: Sequelize.STRING(11),
			allowNull: false,
			unique: true,
			validate: {
				is: /^\d{11}$/,
				notNull: true
			},
		},
		password: {
			type: Sequelize.STRING(64),
			allowNull: false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		nick_name: {
			type: Sequelize.STRING(32),
			allowNull: false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		real_name: Sequelize.STRING(32),
		email: {
			type: Sequelize.STRING,
			allowNull: true,
			validate:{
				isEmail: true
			}
		},
		avatar: Sequelize.STRING(255),
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
			defaultValue: parseInt(Date.now() / 1000 )
		},
		upd_time : Sequelize.INTEGER
	}, {
		tableName: "member"
	});
}