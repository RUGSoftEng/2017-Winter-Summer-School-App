const express = require('express');
const router = express.Router();
const auth = require('../../config/lib/authorisation.js');
const Alert = require('../../config/lib/alert.js');
const Forum = require('mongoose').model('forum');

router.get('/options', auth.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	const user = req.user || {};
	let alert = new Alert();
	alert.initiate(req);

	Forum.find(function (err, forum) {
		res.render('options.ejs', {
			user: user,
			forum: forum,
			alert: alert
		});
	});
});

module.exports = router;
