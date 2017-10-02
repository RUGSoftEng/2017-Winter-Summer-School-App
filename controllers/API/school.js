const express = require('express');
const router  = express.Router();
const data    = require('../../config/database.js');
const Alert   = require('../../config/alert.js');


function schoolParamsAreProvided(req) {
	return typeof req.body.schoolName !== 'undefined' && typeof req.body.startDate !== 'undefined' && typeof req.body.endDate !== 'undefined';
}

function timeFrameIsValid(req) {
	return new Date(req.body.startDate) <= new Date(req.body.endDate);
}

// adds a new school
router.post('/school', data.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	let alert = null;
	if (schoolParamsAreProvided(req) && timeFrameIsValid(req)) {
		data.db.schools.findAndModify(
			{
				query: {_id: "schoolid"},// schoolid is the id of our auto-incrementing item
				update: {$inc: {seq: 1}},
				new: true
			}, function (err, doc, lastErrorObject) {
				if (err) {
					console.log(err);
					throw err;
				} else {
					const newSchool = {
						_id: doc.seq,
						name: req.body.schoolName,
						startDate: req.body.startDate,
						endDate: req.body.endDate,
						addDate: new Date()
					};
					data.db.schools.insert(newSchool, function (err, result) {
						if (err) {
							console.log(err);
							alert = new Alert(false, err);
							alert.passToNextPage(req);
							res.redirect('/options');
						} else {
							alert = new Alert(true, "The school was successfully added.");
							alert.passToNextPage(req);
							res.redirect('/options');
						}
					});
				}
			}
		);


	} else {
		alert = new Alert(false, "The selected timeframe seems invalid. Is the ending date after the starting date?");
		alert.passToNextPage(req);
		res.redirect('/options');
	}
});

router.get('/school', function (req, res) {
	const id = parseInt(req.param('id'));
	if (typeof id !== 'undefined' && Number.isInteger(id) && id >= 1) {
		data.db.schools.find(function (err, schools) {
			var school = schools.find(function (school) {
				return school._id == id;
			});
			if (typeof school === 'undefined') {
				console.log('Error wrong id provided');
				res.send(400);
			} else {
				res.send(school);
			}

		});
	} else {
		res.send(400);
	}

});

// delete a school
router.delete('/school', data.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	const id = parseInt(req.param('id'));
	if(!isNaN(id)) {
		data.db.schools.remove({
			'_id': id
		}, function (err) {
			if (err) throw err;
			res.send(200);
		});
	} else {
		res.send(400);
	}
});

module.exports = router;
