const express         = require('express');
const router          = express.Router();
const Alert           = require('../../config/alert.js');
const data            = require('../../config/database.js');
const dateManipulator = require('../../config/dayManipulation.js');

router.get('/main', data.isAuthorised("ACCESS_MAIN_OVERVIEW"), function (req, res) {
	var user = req.user || "";
	var alert = new Alert();
	alert.initiate(req);
	data.db.announcements.find(function (err, docs) {
		data.db.generalinfo.find(function (err, docs2) {
			var week = req.session.week ? req.session.week : 0;
			dateManipulator.getWeekEvents(req.get('host'), week, function (weekSchedule) {
				data.db.schools.find(function (err, schools) {
					const userSchool = schools.find(function (school) {
						return school._id == user.school;
					});
					res.render('loggedIn.ejs', {
						user: user,
						//announcements: docs,
						school: userSchool,
						generalinfo: docs2,
						schedule: weekSchedule,
						alert: alert
					});

				});

			});
		});
	});
});

module.exports = router;
