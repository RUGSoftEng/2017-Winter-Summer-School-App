const router = require('express').Router();
const auth = require(process.cwd() + '/config/lib/authorisation.js');
const dateManipulator = require(process.cwd() + '/config/lib/dayManipulation.js');

router.get('/main', auth.isAuthorised("ACCESS_MAIN_OVERVIEW"), function (req, res) {
	const week = req.session.week || 0;
	dateManipulator.getWeekEvents(req.get('host'), week, function (weekSchedule) {
		res.render('loggedIn.ejs', {
			user: req.user || {},
			schedule: weekSchedule
		});
	});
});

module.exports = router;
