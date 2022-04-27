module.exports = function (sequelize, Sequelize) {
	// 权限模型
	return sequelize.define("PermissionModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		ps_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		pid : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		name : {
			type: Sequelize.STRING(20),
			allowNull: false
		},
		alias : {
			type: Sequelize.STRING(20),
			allowNull: false
		},
		level : {
			type:Sequelize.INTEGER,
			isIn: [[0, 1, 2]],
		},
		order : Sequelize.INTEGER,
		icon: Sequelize.STRING(255),
		api_service : Sequelize.STRING(255),
		api_action : Sequelize.STRING(255),
		api_path : Sequelize.STRING(255),
	},{
		tableName : "permission"
	});
}