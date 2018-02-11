"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const User = require("mongoose").model("account");
const logger = require(process.cwd() + "/config/lib/logger");

router.delete("/API/user", auth.isAuthorised("ALTER_USERS"), function (req, res) {
	if (req.body.id == req.user._id) {
		res.sendStatus(400);
	} else {
		User.findOneAndRemove({"_id": req.body.id}, function (err) {
			if (err) {
				logger.warning("Can not delete user\n" + err);
				res.sendStatus(400);
			} else {
				res.sendStatus(200);
			}
		});
	}
});


router.post("/API/user", auth.isAuthorised("ALTER_USERS"), function (req, res) {
	const newAccount = new User(req.body);
	newAccount.save(function (err) {
		if (err) {
			logger.warning("Can not add new user\n" + err);
		}
	});
	res.redirect("/options");
});

router.get("/API/user", auth.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	User
		.find(req.query, ["_id", "username", "rank", "school"]) // Do not show hashed password
		.limit(count || 20)
		.exec(function (err, users) {
			if (err) {
				logger.warning("Can not retrieve users\n" + err);
				res.sendStatus(400);
			} else res.send(users);
		});
});


module.exports = router;
