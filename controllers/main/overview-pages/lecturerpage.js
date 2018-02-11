"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");

router.get("/lecturerpage", auth.isAuthorised("OVERVIEW_LECTURERS"), function (req, res) {
	res.render("lecturerpage.ejs", { user: req.user || {} });
});

module.exports = router;
