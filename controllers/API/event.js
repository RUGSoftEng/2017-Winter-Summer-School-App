"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const Event = require("mongoose").model("event");
const logger = require(process.cwd() + "/config/lib/logger");
const calendar = require(process.cwd() + "/config/lib/calendarHelpers");

router.put("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res, next) {
	calendar.mergeDateAndTime(req.query, "start");
	calendar.mergeDateAndTime(req.query, "end");
	Event.findOneAndUpdate({ "_id": req.query.id }, { $set: req.query }, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});

});

router.delete("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res, next) {
	Event.findOneAndRemove({ "_id": req.query.id }, function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});

});

router.post("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res, next) {
	calendar.mergeDateAndTime(req.body, "start");
	calendar.mergeDateAndTime(req.body, "end");
	new Event(req.body).save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect("/main");
		}
	});

});


router.get("/API/event", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	if (!calendar.setInterval(req.query, "week", 7)) {
		calendar.setInterval(req.query, "day", 1);
	}

	Event
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(count || 200)
		.exec(function (err, events) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else {
				res.send(events);
			}
		});
});

module.exports = router;
