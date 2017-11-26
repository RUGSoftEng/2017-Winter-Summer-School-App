var express = require('express');

var router = express.Router();
var data   = require('../../../config/database.js');

router.get('/lecturerpage', data.isAuthorised("OVERVIEW_LECTURERS"), function (req, res) {
	var user = req.user || "";
	data.db.lecturers.find(function (err, docs) {
		res.render('lecturerpage.ejs', {
			user: user,
			lecturers: docs
		});
	});
});

module.exports = router;
	
 
