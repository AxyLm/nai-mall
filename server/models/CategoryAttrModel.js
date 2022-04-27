module.exports = function (sequelize, Sequelize) {
	// 分类参数模型
	return sequelize.define("CategoryAttrModel",{
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
		cat_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		// static:输入框(唯一)  
		// dynamic:后台下拉列表/前台单选框
		type : {
			type: Sequelize.ENUM,
			values: ["static", "dynamic"],
			allowNull: false
		},	
		// manual:手工录入  list:从列表选择
		write: {
			type: Sequelize.ENUM,
			values: ["manual","list"],
			allowNull: false
		},	
		vals: {
			type: Sequelize.TEXT,
			allowNull: false
		}
	},{
		tableName : "category_attr"
	});
}