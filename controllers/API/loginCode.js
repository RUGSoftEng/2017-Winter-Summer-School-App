const express = require('express');
const router = express.Router();
const data = require('../../config/database.js');
const Alert = require('../../config/alert.js');
var LoginCode = require('mongoose').model('loginCode');
const UserRights = require('../../public/dist/js/userRights');

router.post('/API/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	let alert = null;
	const code = new LoginCode({
		code: req.body.code,
		school: req.body.school
	});
	code.save(function (err, codes) {
		if (err) {
			console.log(err);
			const alertMessage = "Failed to insert to database.<br>" + err;
			alert = new Alert(false, alertMessage);
		} else {
			alert = new Alert(true, "The login code was successfully added");
		}
		alert.passToNextPage(req);
		res.redirect('/options');
	});
});

router.get('/API/loginCode', function (req, res) {
	if(req.param('code')) {
		LoginCode.findOne({ code: req.param('code') }, function (err, code) {
			res.send(code ? code.school : 400);
		});
	} else if(UserRights.userHasRights(req.user, "VIEW_OPTIONS")) {
		LoginCode
			.find({})
			.limit(req.param('count') || 20)
			.exec(function (err, codes) {
				if (err) console.log(err);
				else res.send(codes);
			});
	} else res.send(403);
});

router.delete('/API/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	LoginCode.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) res.send(400);
		res.send(200);
	});
});


module.exports = router;
