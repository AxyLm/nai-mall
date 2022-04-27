var path = require("path");
var dao = require(path.join(process.cwd(), "dao/DAO"));
/**
 * 创建token
 * 
 * @param  {[type]}   user token数据集
 * @param  {Function} cb   回调函数
 */
module.exports.createToken = function (params, cb) {
	dao.create("TokenModel", {
		"uid": params.uid,
		"access_token": params.access_token,
		"refresh_token": params.refresh_token,
		"expiresIn": params.expiresIn,
		"grand_type": params.grand_type,
		"client": params.client,
	}, function (err, token) {
		if (err) return cb({
			msg: "令牌创建：创建失败，查询出错！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "令牌创建：创建成功！",
			code: 201,
			data: token
		});
	});
}

/**
 * 更新token
 * 
 * @param  {[type]}   params token信息
 * @param  {Function} cb     回调函数
 */
module.exports.updateToken = function (params, cb) {
	dao.update("TokenModel", params.id, {
		"access_token": params.access_token,
		"refresh_token": params.refresh_token,
		"expiresIn": params.expiresIn,
		"grand_type": params.grand_type,
	}, function (err, newToken) {
		if (err) return cb({
			msg: "令牌更新：更新失败，查询出错！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "令牌更新：更新成功！",
			code: 200,
			data: newToken
		});
	});
};

/**
 * 根据用户id获取token
 * 
 * @param  {[type]}   id 用户ID
 * @param  {Function} cb 回调函数
 */
module.exports.getTokenByUidAndClient = function (uid, client, cb) {
	dao.findOne("TokenModel", {
		uid: uid,
		client: client
	}, function (err, token) {
		if (err) return cb({
			msg: "令牌获取：获取失败，查询出错！",
			code: 500,
			stack: err
		});
		cb(null, {
			msg: "令牌获取：获取成功！",
			code: 200,
			data: token
		});
	});
}