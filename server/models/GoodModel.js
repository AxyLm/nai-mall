module.exports = function (sequelize, Sequelize) {
	// 商品模型
	return sequelize.define("GoodModel",{
		id : { 
			type: Sequelize.INTEGER, 
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		cat_id : {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				notNull: true
			},
		},
		name : {
			type: Sequelize.STRING(255),
			allowNull: false,
			validate: {
				notEmpty: true,
				notNull: true
			},
		},
		price : {
			type: Sequelize.DECIMAL(10,2),
			allowNull: false,
			validate: {
				min: 0,
				notNull: true
			},
		},
		number : {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
				notNull: true
			},
		},
		weight : {
			type: Sequelize.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
				notNull: true
			},
		},
		introduce : Sequelize.TEXT,
		big_logo : Sequelize.STRING(255),
		small_logo : Sequelize.STRING(255),
		// 禁用状态 0:未禁用  1:禁用
		deleted: {
			type:Sequelize.INTEGER,
			validate: {
				isIn: [[0, 1]],
			},
			set(value) {
				var code = 0;
				if(value && String(value)=="true") code = 1;
				this.setDataValue('deleted', code);
			}
		},
		add_time: { 
			type: Sequelize.INTEGER, 
			defaultValue: Date.now() / 1000 
		},
		upd_time : Sequelize.INTEGER,
		delete_time : Sequelize.INTEGER,
		cat_one_id : Sequelize.INTEGER,
		cat_two_id : Sequelize.INTEGER,
		cat_three_id : Sequelize.INTEGER,
		// 促销状态 0:未促销  1:促销
		is_promote : {
			type:Sequelize.INTEGER,
			validate: {
				isIn: [[0, 1]],
			},
			set(value) {
				var code = 0;
				if(value && String(value)=="true") code = 1;
				this.setDataValue('is_promote', code);
			}
		},
		promote_price : {
			type: Sequelize.DECIMAL(10,2),
			validate: {
				min: 0,
			},
		},
		// 推荐状态 0:未推荐  1:推荐
		is_recomend : {
			type:Sequelize.INTEGER,
			validate: {
				isIn: [[0, 1]],
			},
			set(value) {
				var code = 0;
				if(value && String(value)=="true") code = 1;
				this.setDataValue('is_recomend', code);
			}
		},
		// 商品状态 0: 未提交 1: 审核中 2: 已通过 3: 被拒绝
		state : {
			type:Sequelize.INTEGER,
			validate: {
				isIn: [[0, 1, 2, 3]],
			}
		},
		cat: {
			type: Sequelize.VIRTUAL,
			get() {
				return this.cat_one_id + ',' + this.cat_two_id + ',' + this.cat_three_id;
			}
		}
	},{
		tableName : "good",
	});
}