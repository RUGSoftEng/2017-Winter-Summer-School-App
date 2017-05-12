var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');

router.get('/options', function(req, res) {
    res.render('options.ejs', {
        user: 'a'
    });
});

module.exports = router;
