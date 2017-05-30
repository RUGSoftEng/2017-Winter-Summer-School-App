var express         = require('express');
var router          = express.Router();
var Alert           = require('../../config/alert.js');
var data            = require('../../config/database.js');
var dateManipulator = require('../../config/dayManipulation.js');


router.get('/main', data.isLoggedIn, function (req, res) {
    var user;
    if (req.user === undefined) {
        user = "tester";
    }
    else {
        user = req.user
    }
    var alert = new Alert();
    +alert.initiate(req);
    data.db.announcements.find(function (err, docs) {
        data.db.generalinfo.find(function (err, docs2) {
            dateManipulator.getWeekEvents(req.get('host'), function (weekSchedule) {

                res.render('loggedIn.ejs', {
                    user: user,
                    announcements: docs,
                    generalinfo: docs2,
                    schedule: weekSchedule,
                    alert: alert
                });
            });
        });
    });
});

module.exports = router;
