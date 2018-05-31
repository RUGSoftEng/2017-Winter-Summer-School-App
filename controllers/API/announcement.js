"use strict";

const router = require("express").Router();
const auth = require("../../config/lib/authorisation.js");
const Announcement = require("mongoose").model("announcement");

router.put("/API/announcement", auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res, next) {
	// updates the description and title of an announcement
	// corresponding to the given id param.
	Announcement.findOneAndUpdate({ "_id": req.query.id }, {
		$set: {
			title: req.query.title,
			description: req.query.description
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

router.delete("/API/announcement", auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res,next) {
	// deletes the announcements corresponding to the given id param
	Announcement.findOneAndRemove({ "_id": req.query.id }, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});

});

router.post("/API/announcement", auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res, next) {
	new Announcement(req.body).save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect(req.get("referer"));
		}
	});
});

router.get("/API/announcement", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	Announcement
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(count || 200)
		.exec(function (err, announcements) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else res.send(announcements);
		});
});

module.exports = router;
