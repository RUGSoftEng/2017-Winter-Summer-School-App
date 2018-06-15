"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const LoginCode = require("mongoose").model("loginCode");
const UserRights = require(process.cwd() + "/public/dist/js/userRights");
const logger = require(process.cwd() + "/config/lib/logger");

router.post("/API/loginCode", auth.isAuthorised("ALTER_LOGIN_CODES"), function (req, res, next) {
	const code = new LoginCode(req.body);
	code.save(function (err) {
		if (err) {
			err.shouldReload = true;
			err.status = 400;
			next(err);
		} else {
			res.redirect("/options");
		}
	});
});

router.get("/API/loginCode", function (req, res, next) {
	const count = parseInt(req.query.count);
	delete req.query.count;
	if (req.query.code) {
		LoginCode.findOne({ code: req.query.code }, function (err, code) {
			if (err || !code) {
				const err2 = (err || new Error());
				err2.status = 400;
				err2.message = (err.message || "The code does not exist");
				err2.apiCall = true;
				next(err2);
			} else {
				res.send(code);
			}
		});
	} else if (UserRights.userHasRights(req.user, "VIEW_OPTIONS")) {
		LoginCode
			.find({})
			.limit(count || 20)
			.exec(function (err, codes) {
				if (err) {
					err.apiCall = true;
					err.status = 400;
					next(err);
				} else {
					res.send(codes);
				}
			});
	} else res.sendStatus(403);
});

router.delete("/API/loginCode", auth.isAuthorised("ALTER_LOGIN_CODES"), function (req, res, next) {
	LoginCode.findOneAndRemove({ "_id": req.body.id }, function (err) {
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
