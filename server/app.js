var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var path = require('path');
var app = express();

/**
 *
 * 公共模块初始化
 *
 */
app.use(compression());
app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// 上传静态资源托管
app.use('/tmp_uploads', express.static('tmp_uploads'));
app.use('/uploads', express.static('uploads'));

// 初始化日志系统
var logger = require('./modules/logger');
app.use(logger.access());

// 初始化数据库模块
var database = require('./modules/database');
app.use(database.initialize);

// 初始化响应机制
var resextra = require('./modules/resextra');
app.use(resextra);

/**
 *
 * 接口api模块初始化
 *
 */
// 初始化api跨域机制
app.all('/api/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization');
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 初始化登录授权机制（管理后台）
var passport = require('./modules/passport');
passport.init(app);
app.use('/api/admin/getToken', passport.admin.getToken);
app.use('/api/admin/refreshToken', passport.admin.refreshToken);
app.use('/api/admin/*', passport.admin.tokenAuth);

// 初始化登录授权机制（网站前台）
app.use('/api/front/getToken', passport.front.getToken);
app.use('/api/front/refreshToken', passport.front.refreshToken);
app.use('/api/front/*', passport.front.tokenAuth([
    "/api/front/member/register",
    "/api/front/banner/getList",
    "/api/front/good/getPage",
    "/api/front/good/getByID",
    "/api/front/comment/getPage",
    "/api/front/category/getTree",
    "/api/front/config/getAll",
]));

// 初始化鉴权白名单（管理后台）
var authorization = require(path.join(process.cwd(), 'modules/authorization'));
authorization.setOmit({
    RightService: {
        getMyRights: true
    },
    ManagerService: {
        getMe: true
    },
});

// 初始化路由
var mount = require('mount-routes');
mount(app, path.join(process.cwd(), '/routes'), true);

/**
 *
 * 统一处理无响应、端口监听和导出
 *
 */
app.use(function(req, res, next) {
    res.sendResult(null, 404, 'Not Found');
})
app.listen(8888);