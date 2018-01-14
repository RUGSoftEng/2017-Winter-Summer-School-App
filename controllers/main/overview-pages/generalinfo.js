const express = require('express');
const router = express.Router();
const auth   = require('../../../config/lib/authorisation.js');
const Generalinfo = require('mongoose').model('generalinfo');

router.get('/generalinfo', auth.isAuthorised("OVERVIEW_GENERAL_INFO"), function (req, res) {
	const user = req.user || {};
	Generalinfo.find(function (err, docs) {
		res.render('generalinfo.ejs', {
			user: user,
			generalinfo: docs
		});
	});
});

module.exports = router;
	
 
