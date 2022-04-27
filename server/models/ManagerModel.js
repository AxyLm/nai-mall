module.exports = function (sequelize, Sequelize) {
	// 管理员模型
	return sequelize.define("ManagerModel", {
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		pwd: {
			type: Sequelize.STRING(64),
			allowNull: false
		},
		role_id: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		mobile: Sequelize.STRING(20),
		email: Sequelize.STRING(64),
		avatar: Sequelize.STRING(255),
		deleted: {
			type:Sequelize.INTEGER,
			isIn: [[0, 1]],
		},
		add_time: { 
			type: Sequelize.INTEGER, 
			defaultValue: Date.now() / 1000 
		},
	}, {
		tableName: "manager"
	});
}