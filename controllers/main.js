var express = require('express');
var router = express.Router();
var data = require('../config/database.js');
var json = require('../config/getJSON.js');

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
}

function fillWeek(result, startDate, i, callback) {
    if (i == 7) {
        callback();
        return;
    } else {
        var tomorrow = new Date(startDate);
        tomorrow.setDate(startDate.getDate() + 1);
        json.getJSON({
            type: 'GET',
            url:'https://summer-winter-schools.herokuapp.com'+'/calendar/event?startDate=' + startDate.toISOString() + '&endDate=' + tomorrow.toISOString(),
            async: false,
            dataType: 'json',

        }, function(statusCode, res) {
            result[i] = res;
            fillWeek(result, tomorrow, i + 1, callback);
        });
    }

}


router.get('/main', data.isLoggedIn, function(req, res) {
    var startDate = getMonday(new Date());
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    data.db.announcements.find(function(err, docs) {
        data.db.generalinfo.find(function(err, docs2) {
            var result = [];
            fillWeek(result, startDate, 0, function() {
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
