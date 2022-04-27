var express = require("express");
var router = express.Router();
var qs = require("querystring");

var config = require("config").get("oauth2_config");
var appID = config.get("appID");
var appKey = config.get("appKey");
var redirect_url = config.get("redirect_url");
var get_code_url = config.get("get_code_url");
var get_token_url = config.get("get_token_url");
var get_me_url = config.get("get_me_url");
var get_userinfo_url = config.get("get_userinfo_url");

router.get('/login', function (req, res, next) {
    let options = {
        response_type: 'code',
        client_id: appID,
        redirect_url,
        state: Date.now(),
        scope:'get_user_info'
    }
    let query = qs.stringify(options);
    get_code_url += query;
    res.render('wap/login',{
        title:'登录',get_code_url
    });
});

router.get('/callback', function (req, res, next) {
    let { code } = req.query;
    res.send(code);
});

module.exports = router;