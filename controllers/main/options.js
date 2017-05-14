var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');

router.get('/options', data.isLoggedIn, function(req, res) {
    res.render('options.ejs', {
        user: req.user
    });
});

module.exports = router;
