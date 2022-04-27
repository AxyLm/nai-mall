// passport是Node下的权限认证框架，轻量，简单，拓展性强
const path = require("path");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
var jwt = require("jsonwebtoken");
var jwt_config = require("config").get("jwt_config");
var managerService = require(path.join(process.cwd(), "services/ManagerService"));
var memberService = require(path.join(process.cwd(), "services/MemberService"));
var tokenService = require(path.join(process.cwd(), "services/TokenService"));
function genAdminToken(uid, rid, type) {
	var grand_type = "";
	if (type == "refresh") {
		grand_type = "refresh";
	} else {
		grand_type = "password";
	}
	// 生成 access_token
	var accessToken = jwt.sign(
		{ "uid": uid, "rid": rid },
		jwt_config.get("secretKey"),
		{ "expiresIn": jwt_config.get("accessTokenExpiresIn") }
	);
	// 生成 refresh_token
	var refreshToken = jwt.sign(
		{ "uid": uid, "rid": rid },
		jwt_config.get("secretKey"),
		{ "expiresIn": jwt_config.get("refreshTokenExpiresIn") }
	);
	return {
		uid,
		access_token: "Bearer " + accessToken,
		refresh_token: "Bearer " + refreshToken,
		expiresIn: jwt_config.get("accessTokenExpiresIn"),
		grand_type,
		client: "admin"
	}
}
function genFrontToken(uid, type) {
	var grand_type = "";
	if (type == "refresh") {
		grand_type = "refresh";
	} else {
		grand_type = "password";
	}
	// 生成 access_token
	var accessToken = jwt.sign(
		{ "uid": uid },
		jwt_config.get("secretKey"),
		{ "expiresIn": jwt_config.get("accessTokenExpiresIn") }
	);
	// 生成 refresh_token
	var refreshToken = jwt.sign(
		{ "uid": uid },
		jwt_config.get("secretKey"),
		{ "expiresIn": jwt_config.get("refreshTokenExpiresIn") }
	);
	return {
		uid,
		access_token: "Bearer " + accessToken,
		refresh_token: "Bearer " + refreshToken,
		expiresIn: jwt_config.get("accessTokenExpiresIn"),
		grand_type,
		client: "wap"
	}
}

module.exports = {
	init: function (app) {
		// 后台access_token      生成策略
		passport.use("genAdminAccessToken",new CustomStrategy(function (req, done) {
			var username = req.body.username;
			var password = req.body.password;
			managerService.login(username, password, function (err, user) {
				if (err) return done(err);
				var uid = user.data.id;
				var rid = user.data.role_id;
				var token = genAdminToken(uid, rid, "password");
				// 判断该用户的token是否已经在数据库中创建过
				tokenService.getTokenByUidAndClient(uid, token.client, function (err, oldResult) {
					if (err) return done(err);
					if (oldResult.data) {
						// 把token更新到数据库token表
						token.id = oldResult.data.id;
						tokenService.updateToken(token, function (err, newResult) {
							if (err) return done(err);
							done(null, newResult);
						});
					} else {
						// 把token添加到数据库token表
						tokenService.createToken(token, function (err, newResult) {
							if (err) return done(err);
							done(null, newResult);
						});
					}
				});
			});
		}));
		// 后台access_token 	 刷新策略
		passport.use("rfsAdminAccessToken", new CustomStrategy(function (req, done) {
			// 获取refresh_token
			var refresh_token = req.headers.authorization || "";
			refresh_token = refresh_token.split("Bearer ");
			refresh_token = refresh_token[refresh_token.length - 1];
			// 验证refresh_token
			jwt.verify(refresh_token, jwt_config.get("secretKey"), function (err, decode) {
				// refresh_token无效，返回错误
				if (err) return done({
					code: 500,
					msg: "令牌：会话异常！",
					stack: err
				});
				// refresh_token有效，生成新token
				var token = genAdminToken(decode.uid, decode.rid, "refresh");
				tokenService.getTokenByUidAndClient(decode.uid, token.client, function (err, oldResult) {
					if (err) return done(err);
					token.id = oldResult.data.id;
					tokenService.updateToken(token, function (err, newResult) {
						if (err) return done(err);
						done(null, newResult);
					});
				});
			});
		}));
		// 后台access_token 	 验证策略
		passport.use("vldAdminAccessToken",new CustomStrategy(function (req, done) {
			var access_token = req.headers.authorization || "";
			access_token = access_token.split("Bearer ");
			access_token = access_token[access_token.length - 1];
			jwt.verify(access_token, jwt_config.get("secretKey"), function (err, decode) {
				if (err) { return done(err); }
				return done(null, decode);
			});
		}));
		// 前台access_token      生成策略
		passport.use("genFrontAccessToken",new CustomStrategy(function (req, done) {
			var telephone = req.body.telephone || "";
			var password = req.body.password;
			memberService.login(telephone, password, function (err, member) {
				if (err) return done(err);
				var uid = member.data.id;
				var token = genFrontToken(uid, "password");
				// 判断该用户的token是否已经在数据库中创建过
				tokenService.getTokenByUidAndClient(uid, token.client, function (err, oldResult) {
					if (err) return done(err);
					if (oldResult.data) {
						// 把token更新到数据库token表
						token.id = oldResult.data.id;
						tokenService.updateToken(token, function (err, newResult) {
							if (err) return done(err);
							done(null, newResult);
						});
					} else {
						// 把token添加到数据库token表
						tokenService.createToken(token, function (err, newResult) {
							if (err) return done(err);
							done(null, newResult);
						});
					}
				});
			});
		}));
		// 前台access_token 	 刷新策略
		passport.use("rfsFrontAccessToken", new CustomStrategy(function (req, done) {
			// 获取refresh_token
			var refresh_token = req.headers.authorization || "";
			refresh_token = refresh_token.split("Bearer ");
			refresh_token = refresh_token[refresh_token.length - 1];
			// 验证refresh_token
			jwt.verify(refresh_token, jwt_config.get("secretKey"), function (err, decode) {
				// refresh_token无效，返回错误
				if (err) return done({
					code: 500,
					msg: "令牌：会话异常！",
					stack: err
				});
				// refresh_token有效，生成新token
				var token = genFrontToken(decode.uid, "refresh");
				tokenService.getTokenByUidAndClient(decode.uid, token.client, function (err, oldResult) {
					if (err) return done(err);
					token.id = oldResult.data.id;
					tokenService.updateToken(token, function (err, newResult) {
						if (err) return done(err);
						done(null, newResult);
					});
				});
			});
		}));
		// 前台access_token 	 验证策略
		passport.use("vldFrontAccessToken",new CustomStrategy(function (req, done) {
			var access_token = req.headers.authorization || "";
			access_token = access_token.split("Bearer ");
			access_token = access_token[access_token.length - 1];
			jwt.verify(access_token, jwt_config.get("secretKey"), function (err, decode) {
				if (err) { return done(err); }
				return done(null, decode);
			});
		}));
		// 初始化passport模块
		app.use(passport.initialize());
	},
	admin:{
		/**
		 * 根据用户名和密码获取token逻辑
		 * 登录请求--->通过路由匹配到该中间件-->调用authenticate高阶函数，并为其传req,res,next-->
		 * authenticate根据第一个参数，匹配到LocalStrategy策略-->
		 * authenticate把第二个回调参数，传递给LocalStrategy的验证回调-->
		 * LocalStrategy从req中取username和password，传递给LocalStrategy的验证回调-->
		 * 触发验证回调
		 * @param  {[type]}   req  请求
		 * @param  {[type]}   res  响应
		 * @param  {Function} next [description]
		 */
		getToken: function (req, res, next) {
			passport.authenticate("genAdminAccessToken", function (err, result) {
				if (err) return res.sendResult(null, err.code, err.msg, err.stack);
				res.sendResult(result.data, result.code, "登录成功", null);
			})(req, res, next);
		},
		/**
		 * 根据refresh_token重新颁发access_token逻辑
		 * @param  {[type]}   req  请求
		 * @param  {[type]}   res  响应
		 * @param  {Function} next [description]
		 */
		refreshToken: function (req, res, next) {
			passport.authenticate("rfsAdminAccessToken", { session: false }, function (err, result) {
				if (err) return res.sendResult(null, err.code, err.msg, err.stack);
				return res.sendResult(result.data, result.code, result.msg, null);
			})(req, res, next);
		},
		/**
		 * token验证函数
		 * 接口请求--->通过路由匹配到该中间件-->调用authenticate高阶函数，并为其传req,res,next-->
		 * authenticate根据第一个参数，匹配到Strategy策略-->
		 * authenticate把第三个回调参数，传递给Strategy的验证回调-->
		 * Strategy从请求头中取Authorization，传递给Strategy的验证回调-->
		 * 触发验证回调
		 * @param  {[type]}   req  请求对象
		 * @param  {[type]}   res  响应对象
		 * @param  {Function} next 传递事件函数
		 */
		tokenAuth: function (req, res, next) {
			passport.authenticate("vldAdminAccessToken", { session: false }, function (err, tokenData) {
				if (err) return res.sendResult(null, 401, "无效token", err);
				if (!tokenData) return res.sendResult(null, 401, "无效token", null);
				req.userInfo = {};
				req.userInfo.uid = tokenData["uid"];
				req.userInfo.rid = tokenData["rid"];
				next();
			})(req, res, next);
		}
	},
	front:{
		getToken: function (req, res, next) {
			passport.authenticate("genFrontAccessToken", function (err, result) {
				if (err) return res.sendResult(null, err.code, err.msg, err.stack);
				res.sendResult(result.data, result.code, "登录成功", null);
			})(req, res, next);
		},
		refreshToken: function (req, res, next) {
			passport.authenticate("rfsFrontAccessToken", { session: false }, function (err, result) {
				if (err) return res.sendResult(null, err.code, err.msg, err.stack);
				return res.sendResult(result.data, result.code, result.msg, null);
			})(req, res, next);
		},
		tokenAuth: function (omit=[]) {
			return function(req, res, next){
				for(var i = 0; i<omit.length; i++){
					if(req.originalUrl.startsWith(omit[i])){
						return next();
					}
				}
				passport.authenticate("vldFrontAccessToken", { session: false }, function (err, tokenData) {
					if (err) return res.sendResult(null, 401, "无效token", err);
					if (!tokenData || !tokenData.uid) return res.sendResult(null, 401, "无效token", null);
					req.userInfo = {};
					req.userInfo.uid = tokenData["uid"];
					next();
				})(req, res, next);
			}
		}
	}
}