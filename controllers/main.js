var express = require('express');
var router = express.Router();
var data = require('../config/database.js');

router.get('/main', data.isLoggedIn, function(req, res) {
    data.db.announcements.find(function(err, docs) {
        data.db.generalinfo.find(function(err, docs2) {
            res.render('loggedIn.ejs', {
                user: req.user,
                announcements: docs,
                generalinfo: docs2
            })
        });
    });
});

module.exports = router;