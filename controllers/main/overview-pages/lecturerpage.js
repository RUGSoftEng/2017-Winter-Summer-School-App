const express = require('express');
const router = express.Router();
const auth   = require('../../../config/lib/authorisation.js');
const Lecturer = require('mongoose').model('lecturer');

router.get('/lecturerpage', auth.isAuthorised("OVERVIEW_LECTURERS"), function (req, res) {
	const user = req.user || {};
	Lecturer.find(function (err, docs) {
		res.render('lecturerpage.ejs', {
			user: user,
			lecturers: docs
		});
	});
});

module.exports = router;
	
 
