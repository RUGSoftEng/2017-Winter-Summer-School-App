var express = require('express');
var router  = express.Router();
var data    = require('../../../config/database.js');
var Announcement = require('mongoose').model('announcement')

router.get('/announcepage', data.isAuthorised("OVERVIEW_ANNOUNCE"), function (req, res) {
	var user = req.user || "";
	Announcement.find(function (err, docs) {
		res.render('announcements.ejs', {
			user: user,
			announcements: docs
		});
	});
});

module.exports = router;
	
 
