module.exports = function (sequelize, Sequelize) {
	// 角色模型
	return sequelize.define("RoleModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name : {
			type: Sequelize.STRING(20),
			allowNull: false
		},
		ps_ids : {
			type: Sequelize.STRING(512),
			allowNull: false
		},
		ps_ca : Sequelize.TEXT,
		desc : Sequelize.TEXT
	},{
		tableName : "role"
	});
}