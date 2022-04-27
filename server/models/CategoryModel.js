module.exports = function (sequelize, Sequelize) {
	// 分类模型
	return sequelize.define("CategoryModel",{
		id: { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		name : {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		pid : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		level : Sequelize.INTEGER,
		icon : Sequelize.STRING(255),
		src : Sequelize.TEXT,
		deleted: {
			type:Sequelize.INTEGER,
			isIn: [[0, 1]],
		},
	},{
		tableName : "category"
	});
}