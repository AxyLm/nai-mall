// 添加统一的返回结果方法
module.exports = function(req, res, next){
	res.sendResult = function(data,code,message,stack) {
		if(code == 401) {
			res.status(code).json({
				"data" : null,
				"meta" : {
					"msg" 		: message
				}
			});
		}else{
			res.json({
				"data" : data, 
				"meta" : {
					"msg" 		: message,
					"status" 	: code,
					"stack"		: stack
				}
			});
		}
	};
	next();
}