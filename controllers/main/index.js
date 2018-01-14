const express = require('express');
const router = express.Router();
const Alert = require('../../config/lib/alert.js');
const auth = require('../../config/lib/authorisation.js');
const dateManipulator = require('../../config/lib/dayManipulation.js');

router.get('/main', auth.isAuthorised("ACCESS_MAIN_OVERVIEW"), function (req, res) {
	const user = req.user || {};
	let alert = new Alert();
	alert.initiate(req);
	const week = req.session.week || 0;
	dateManipulator.getWeekEvents(req.get('host'), week, function (weekSchedule) {
		res.render('loggedIn.ejs', {
			user: user,
			schedule: weekSchedule,
			alert: alert
		});
	});
});

module.exports = router;
