const express = require('express');
const router = express.Router();
const data = require('../../config/database.js');
const Alert = require('../../config/alert.js');
var mongoose = require('mongoose');
var School = mongoose.model('school');

// adds a new school
router.post('/API/school', data.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	let alert = null;
	var school = new School({
		name: req.body.schoolName,
		startDate: new Date(req.body.startDate),
		endDate: new Date(req.body.endDate)
	});

	school.save(function (err) {
		if (err) {
			alert = new Alert(false, "Failed to add school: " + err);
			alert.passToNextPage(req);
			res.redirect('/options');
			res.send(400);
		} else {
			alert = new Alert(true, "The school was successfully added.");
			alert.passToNextPage(req);
			res.redirect('/options');
			res.send(200);
		}
	});

});

router.get('/API/school', data.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	if(req.param('id')) {
		School.findById(req.param('id'), function (err, school) {
			if (typeof school === 'undefined' || err) {
				console.log('Error wrong id provided');
				res.send(400);
			} else {
				res.send(school);
			}
		});
	} else {
		School
			.find({})
			.limit(req.param('count') || 10)
			.exec(function (err, schools) {
				if (err) console.log(err);
				else res.send(schools);
			});
	}

});

// delete a school
router.delete('/API/school', data.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	School.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) throw err;
		res.send(200);
	});
});

module.exports = router;
