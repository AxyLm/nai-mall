module.exports = function (sequelize, Sequelize) {
	// token模型
	return sequelize.define("TokenModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		uid : {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				isInt: true,
				notNull: true,
			}
		},
		access_token : {
			type: Sequelize.STRING(255),
			allowNull: false,
			validate:{
				notEmpty: true,
				notNull: true
			}
		},
		refresh_token : {
			type: Sequelize.STRING(255),
			allowNull: false,
			validate:{
				notEmpty: true,
				notNull: true
			}
		},
		expiresIn : {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				isInt: true,
				notNull: true,
			}
		},
		// 授权类型：password-登录授权,refresh-刷新token
		grand_type : {
			type: Sequelize.STRING(8),
			allowNull: false,
			validate:{
				notEmpty: true,
				notNull: true
			}
		},
		// 客户端类型：admin-管理后台，wap-移动端，pc-电脑端
		client : {
			type: Sequelize.STRING(5),
			allowNull: false,
			validate:{
				notEmpty: true,
				notNull: true
			}
		}
	},{
		tableName : "token"
	});
}