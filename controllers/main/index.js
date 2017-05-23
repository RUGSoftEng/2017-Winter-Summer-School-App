var express = require('express');
var router = express.Router();
var Alert = require.main.require('./config/alert.js');
var data = require.main.require('./config/database.js');
var dateManipulator = require.main.require('./config/dayManipulation.js');


router.get('/main', data.isLoggedIn, function(req, res) {
	var alert = new Alert();
	alert.initiate(req);
    data.db.announcements.find(function(err, docs) {
        data.db.generalinfo.find(function(err, docs2) {
            dateManipulator.getWeekEvents(req.get('host'),function(weekSchedule) {
                res.render('loggedIn.ejs', {
                    user: req.user,
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
