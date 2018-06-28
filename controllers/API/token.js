"use strict";

/*
 * This controller serves as an API to add tokens (FireBase user tokens) to
 * our database. The mobile application can send a post request to this url
 * which would then be stored in the database by this controller.
 * TODO: Verify token, increase security
 */

const router = require("express").Router();
const Token = require("mongoose").model("token");

router.post("/API/token", function (req, res, next) {
	const newToken = new Token(req.body);

	newToken.save(function (err) {
		if (err) {
			err.apiCall = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});


module.exports = router;
