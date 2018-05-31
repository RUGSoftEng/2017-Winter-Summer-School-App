"use strict";

const router = require("express").Router();
const auth = require("../../config/lib/authorisation.js");
const Generalinfo = require("mongoose").model("generalinfo");

router.delete("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res, next) {
	Generalinfo.findOneAndRemove({ "_id": req.query.id }, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});

});

router.put("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res, next) {
	Generalinfo.findOneAndUpdate({ "_id": req.query.id }, {
		$set: {
			title: req.query.title,
			description: req.query.description,
			category: req.query.category
		}
	}, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});

});


router.post("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res, next) {
	const newGeneralInfo = new Generalinfo(req.body);
	newGeneralInfo.save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect(req.get("referer"));
		}
	});
});

router.get("/API/generalinfo", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	Generalinfo
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(count || 200)
		.exec(function (err, generalinfo) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else {
				res.send(generalinfo);
			}
		});
});

module.exports = router;
