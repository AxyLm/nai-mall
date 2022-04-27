module.exports = function (sequelize, Sequelize) {
	// 商品参数模型
	return sequelize.define("GoodAttrModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		good_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		attr_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		value : {
			type: Sequelize.TEXT,
			allowNull: false
		},
		add_price :  {
			type: Sequelize.DECIMAL(10,2)
		}
	},{
		tableName : "good_attr"
	});
}