module.exports = function (sequelize, Sequelize) {
	// 公共配置模型
	return sequelize.define("ConfigModel", {
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		register_info: Sequelize.TEXT,
		aftersale_info: Sequelize.TEXT,
		server_tel: Sequelize.STRING(15),
		aftersale_tel: Sequelize.STRING(15),
	}, {
		tableName: "config"
	});
}