const express = require('express');
const router = express.Router();
const auth = require('../../config/lib/authorisation.js');
const Alert = require('../../config/lib/alert.js');
const School = require('mongoose').model('school');
const logger = require(process.cwd() + '/config/lib/logger');

// adds a new school
router.post('/API/school', auth.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	let alert = null;
	var school = new School({
		name: req.body.schoolName,
		startDate: new Date(req.body.startDate),
		endDate: new Date(req.body.endDate)
	});

	school.save(function (err) {
		if (err) {
			logger.warning('Can not add school\n' + err);
			alert = new Alert(false, "Failed to add school: " + err);
			alert.passToNextPage(req);
			res.redirect('/options');
			res.sendStatus(400);
		} else {
			alert = new Alert(true, "The school was successfully added.");
			alert.passToNextPage(req);
			res.redirect('/options');
			res.sendStatus(200);
		}
	});

});

router.get('/API/school', auth.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	if (req.query.id) {
		School.findById(req.query.id, function (err, school) {
			if (typeof school === 'undefined' || err) {
				logger.warning('Can not find school\n' + (err || 'Wrong id provided'));
				res.sendStatus(400);
			} else {
				res.send(school);
			}
		});
	} else {
		School
			.find({})
			.limit(req.query.count || 10)
			.exec(function (err, schools) {
				if (err) {
					logger.warning('Can not retrieve schools\n' + err);
					res.sendStatus(400);
				} else res.send(schools);
			});
	}

});

// delete a school
router.delete('/API/school', auth.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	School.findOneAndRemove({
		'_id': req.body.id
	}, function (err) {
		if (err) {
			logger.warning('Can not deleted school\n' + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;
