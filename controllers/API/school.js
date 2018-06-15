"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const School = require("mongoose").model("school");

// adds a new school
router.post("/API/school", auth.isAuthorised("ALTER_SCHOOLS"), function (req, res, next) {
	const school = new School({
		name: req.body.schoolName,
		startDate: new Date(req.body.startDate),
		endDate: new Date(req.body.endDate)
	});

	school.save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect("/options");
		}
	});

});

router.get("/API/school", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	School
		.find(req.query)
		.limit(count || 10)
		.exec(function (err, schools) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else {
				res.status(200).send(schools);
			}
		});
});

// delete a school
router.delete("/API/school", auth.isAuthorised("ALTER_SCHOOLS"), function (req, res, next) {
	School.findOneAndRemove({ "_id": req.body.id }, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;
