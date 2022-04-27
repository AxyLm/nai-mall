var express = require("express");
var router = express.Router();

router.get("/authorize", function (req, res, next) {
    res.render("oauth2.0/login", {
        title:'授权服务器',
    });
});

router.get("/token", function (req, res, next) {
    res.send("token");
});

router.get("/me", function (req, res, next) {
    res.send("me");
});

module.exports = router;