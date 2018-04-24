"use strict";

const router = require("express").Router();
const auth = require("../../config/lib/authorisation.js");
const Generalinfo = require("mongoose").model("generalinfo");
const logger = require(process.cwd() + "/config/lib/logger");

router.delete("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndRemove({ "_id": req.query.id }, function (err) {
		if (err) {
			logger.warning("Can not delete general info\n" + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});

});

router.put("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndUpdate({ "_id": req.query.id }, {
		$set: {
			title: req.query.title,
			description: req.query.description,
			category: req.query.category
		}
	}, function (err) {
		if (err) {
			logger.warning("Can not edit general info\n" + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});

});


router.post("/API/generalinfo", auth.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	const newGeneralInfo = new Generalinfo(req.body);
	newGeneralInfo.save(function (err) {
		if (err) {
			logger.warning(err);
		}
		res.redirect(req.get("referer"));
	});

});

router.get("/API/generalinfo", function (req, res) {
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
				logger.warning("Can not retrieve general info\n" + err);
				res.sendStatus(400);
			} else res.send(generalinfo);
		});
});

module.exports = router;
