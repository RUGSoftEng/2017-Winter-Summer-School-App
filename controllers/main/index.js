const express = require('express');
const router = express.Router();
const Alert = require('../../config/alert.js');
const data = require('../../config/database.js');
const dateManipulator = require('../../config/dayManipulation.js');
var mongoose = require('mongoose');
var Generalinfo = mongoose.model('generalinfo');

router.get('/main', data.isAuthorised("ACCESS_MAIN_OVERVIEW"), function (req, res) {
	var user = req.user || "";
	var alert = new Alert();
	alert.initiate(req);
	Generalinfo.find(function (err, docs2) {
		var week = req.session.week ? req.session.week : 0;
		dateManipulator.getWeekEvents(req.get('host'), week, function (weekSchedule) {
			res.render('loggedIn.ejs', {
				user: user,
				generalinfo: docs2,
				schedule: weekSchedule,
				alert: alert
			});
		});
	});
});

module.exports = router;
