"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");

router.get("/forumpage", auth.isAuthorised("OVERVIEW_FORUM"), function (req, res) {
	res.render("forumpage.ejs", {user: req.user || {}});
});

module.exports = router;
