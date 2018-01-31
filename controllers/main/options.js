"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");

router.get("/options", auth.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	res.render("options.ejs", {user: req.user || {}});
});

module.exports = router;
