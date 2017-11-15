var express = require('express');
var router = express.Router();
var data   = require('../../../config/database.js');
var Generalinfo = require('mongoose').model('generalinfo');

router.get('/generalinfo', data.isAuthorised("OVERVIEW_GENERAL_INFO"), function (req, res) {
	var user = req.user || "";
	Generalinfo.find(function (err, docs) {
		res.render('generalinfo.ejs', {
			user: user,
			generalinfo: docs
		});
	});
});

module.exports = router;
	
 
