const express = require('express');

const router = express.Router();
const data   = require('../../config/database.js');
const Alert  = require('../../config/alert.js');
const mongoose = require('mongoose');
var User = mongoose.model('account');
var LoginCode = mongoose.model('loginCode');
var School = mongoose.model('school');
var Forum = mongoose.model('forum');

router.get('/options', data.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	const user = req.user || "";
	var alert = new Alert();
	alert.initiate(req);

	User.find(function (err, docs) {
		LoginCode.find(function (err, docs2) {
			Forum.find(function (err, docs3) {
				School.find(function (err, docs4) {
					res.render('options.ejs', {
						user: user,
						accounts: docs,
						loginCodes: docs2,
						forum: docs3,
						schools: docs4,
						alert: alert
					});
				});
			});
		});
	});
});

module.exports = router;
