"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const User = require("mongoose").model("account");

router.delete("/API/user", auth.isAuthorised("ALTER_USERS"), function (req, res, next) {
	if (req.body.id == req.user._id) {
		res.sendStatus(400);
	} else {
		User.findOneAndRemove({ "_id": req.body.id }, function (err) {
			if (err) {
				err.shouldReload = true;
				err.status = 400;
				next(err);
			} else {
				res.sendStatus(200);
			}
		});
	}
});


router.post("/API/user", auth.isAuthorised("ALTER_USERS"), function (req, res, next) {
	const newAccount = new User(req.body);
	newAccount.save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect("/options");
		}
	});
});

router.get("/API/user", auth.isAuthorised("VIEW_OPTIONS"), function (req, res, next) {
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
				err.shouldReload = true;
				err.status = 400;
				next(err);
			} else {
				res.send(users);
			}
		});
});


module.exports = router;
