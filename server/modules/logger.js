// log4js 是一个 nodejs 日志管理工具，可以将日志以各种形式输出到各种渠道。
var log4js = require('log4js');

/**
 * 自定义格式
 * log4js.addLayout("json",function(cfg){
 *		return function(logEvent){
 *			console.log(JSON.stringify(logEvent)+cfg.separator);
 *			return JSON.stringify(logEvent)+cfg.separator;
 *		}
 *	});
 */

log4js.configure({
	appenders: {
		console: {
			type: 'console'
		},
		access: {
			type: 'dateFile',
			// layout:{
			// 	type:"json",
			// 	separator:","
			// },
			filename: 'logs/access/access',
			pattern: '-dd--hh.log',
			alwaysIncludePattern: true
		},
		system: {
			type: 'dateFile',
			filename: 'logs/system/system',
			pattern: '-dd.log',
			alwaysIncludePattern: true
		},
		database: {
			type: 'dateFile',
			filename: 'logs/database/database',
			pattern: '-dd.log',
			alwaysIncludePattern: true
		},
		errorLog: {
			type: 'dateFile',
			filename: 'logs/errors/error',
			pattern: '-MM-dd.log',
			alwaysIncludePattern: true
		},
		error: {
			type: 'logLevelFilter',
			level: 'ERROR',
			appender: 'errorLog'
		}
	},
	categories: {
		default: {
			appenders: ["console"],
			level: "trace"
		},
		access: {
			appenders: ["access", "console", "error"],
			level: "trace"
		},
		system: {
			appenders: ["system", "console", "error"],
			level: "trace"
		},
		database: {
			appenders: ["database", "console", "error"],
			level: "trace"
		}
	},
	replaceConsole: true
});
// log4js的输出等级:trace/debug/info/warn/error/fatal
module.exports = {
	access: function () {
		return log4js.connectLogger(log4js.getLogger('access'), {
			level: 'auto',
			format: '[:remote-addr :method :status :url :response-timems]'
		});
	},
	system: function () {
		return log4js.getLogger('system');
	},
	database: function () {
		return log4js.getLogger('database');
	}
};