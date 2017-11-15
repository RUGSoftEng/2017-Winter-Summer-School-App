const express = require('express');
const router = express.Router();
const data = require('../../config/database.js');
const Alert = require('../../config/alert.js');
var LoginCode = require('mongoose').model('loginCode');

router.post('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
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

router.get('/loginCode', function (req, res) {
	const codeParam = req.param('code');
	LoginCode.findOne({ code: codeParam }, function (err, code) {
		if (code) {
			res.send(loginCode.school);
		} else {
			res.send(400);
		}
	});
});

router.delete('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	LoginCode.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) res.send(400);
		res.send(200);
	});
});


module.exports = router;
