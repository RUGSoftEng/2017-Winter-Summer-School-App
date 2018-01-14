const express = require('express');
const router  = express.Router();
const auth    = require('../../../config/lib/authorisation.js');
const Announcement = require('mongoose').model('announcement');

router.get('/announcepage', auth.isAuthorised("OVERVIEW_ANNOUNCE"), function (req, res) {
	const user = req.user || {};
	Announcement.find(function (err, docs) {
		res.render('announcements.ejs', {
			user: user,
			announcements: docs
		});
	});
});

module.exports = router;
	
 
