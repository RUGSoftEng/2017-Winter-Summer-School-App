"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");

router.get("/generalinfo", auth.isAuthorised("OVERVIEW_GENERAL_INFO"), function (req, res) {
	res.render("generalinfo.ejs", {user: req.user || {}});
});

module.exports = router;
