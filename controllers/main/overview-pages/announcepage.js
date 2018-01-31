"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");

router.get("/announcepage", auth.isAuthorised("OVERVIEW_ANNOUNCE"), function (req, res) {
	res.render("announcements.ejs", { user: req.user || {} });
});

module.exports = router;
