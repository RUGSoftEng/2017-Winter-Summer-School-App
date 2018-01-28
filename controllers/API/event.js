"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const Event = require("mongoose").model("event");
const logger = require(process.cwd() + "/config/lib/logger");
const calendar = require(process.cwd() + "/config/lib/calendarHelpers");

router.put("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res) {
	Event.findOneAndUpdate({"_id": req.query.id}, {$set: req.query}, function (err) {
		if (err) {
			logger.warning("Unable to edit event.\n" + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});

});

router.delete("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res) {
	Event.findOneAndRemove({"_id": req.query.id}, function (err) {
		if (err) {
			logger.warning("Unable to delete event.\n" + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});

});

router.post("/API/event", auth.isAuthorised("ALTER_CALENDAR"), function (req, res) {
	new Event(req.body).save(function (err) {
		if (err) {
			logger.warning("Unable to post event.\n" + err);
		}
		res.redirect("/main");
	});

});


router.get("/API/event", function (req, res) {
	if (!calendar.setInterval(req.query, "week", 7)) {
		calendar.setInterval(req.query, "day", 1);
	}

	Event
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(req.query.count || 200)
		.exec(function (err, events) {
			if (err) {
				logger.warning("Can not retrieve events\n" + err);
				res.sendStatus(400);
			} else res.send(events);
		});
});

module.exports = router;
