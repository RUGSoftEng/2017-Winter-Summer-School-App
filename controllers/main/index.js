var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');
var dateManipulator = require.main.require('./config/dayManipulation.js');


router.get('/main', data.isLoggedIn, function(req, res) {
    var startDate = dateManipulator.getMondayOfThisWeek(new Date());
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    data.db.announcements.find(function(err, docs) {
        data.db.generalinfo.find(function(err, docs2) {
            var weekSchedule = [];
            dateManipulator.setEveryDayOfTheWeek(weekSchedule, startDate, 0, function() {
                res.render('loggedIn.ejs', {
                    user: req.user,
                    announcements: docs,
                    generalinfo: docs2,
                    schedule: weekSchedule
                });
            });
        });
    });
});

module.exports = router;