module.exports = function (sequelize, Sequelize) {
	// 订单模型
	return sequelize.define("OrderModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		user_id : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		user_name : {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		code : {
			type: Sequelize.STRING(32),
			allowNull: false
		},
		good_count : {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		good_money : {
			type: Sequelize.DECIMAL(10,2),
			allowNull: false
		},
		freight_money : {
			type: Sequelize.DECIMAL(10,2),
			allowNull: false
		},
		total_money : {
			type: Sequelize.DECIMAL(10,2),
			allowNull: false
		},
		receive_name : Sequelize.STRING(20),
		receive_tel : Sequelize.STRING(11),
		receive_address : Sequelize.STRING(255),
		// 1-支付宝  2-微信  3-银行卡
		pay_type : {
			type:Sequelize.INTEGER,
			isIn: [[1, 2, 3]],
			allowNull: false
		}, 
		pay_no : Sequelize.STRING(32),
		// 0-邮寄 1-自提  
		is_self_take : {
			type:Sequelize.INTEGER,
			isIn: [[0, 1]],
			allowNull: false
		},
		// 0-个人，1-公司
		fapiao_title : {
			type:Sequelize.INTEGER,
			isIn: [[0, 1]],
		}, 
		fapiao_company : Sequelize.STRING(32),
		fapiao_content : Sequelize.STRING(32),
		// 0-已提交，1-已付款，2-已发货，3-已确认，4-已评价，5-已关闭
		status : {
			type:Sequelize.INTEGER,
			isIn: [[0, 1, 2, 3, 4, 5]],
			allowNull: false
		}, 
		add_time: { 
			type: Sequelize.INTEGER, 
			defaultValue: Date.now() / 1000 
		},
		upd_time : Sequelize.INTEGER
	},{
		tableName : "order"
	});
}