var express = require('express');
var router = express.Router();
var data = require('../config/database.js');
var json = require('../config/getJSON.js');

function getWeekEvents(callback) {
    var date = "NULL";
    var week = 0;
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?startDate=' + date + '&endDate=' + date + "&week=" + week,
        host: 'localhost',
        port: 8080,
        async: false,
        dataType: 'json'
    }, function(statusCode, res) {
        callback(res);
    })
}

router.get('/main', data.isLoggedIn, function(req, res) {

    data.db.announcements.find(function(err, docs) {
        data.db.generalinfo.find(function(err, docs2) {
            getWeekEvents(function(result) {
                res.render('loggedIn.ejs', {
                    user: req.user,
                    announcements: docs,
                    generalinfo: docs2,
                    schedule: result
                });
            });



        });
    });
});

module.exports = router;
