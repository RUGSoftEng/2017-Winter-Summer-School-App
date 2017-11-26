const express = require('express');
const router  = express.Router();
const data    = require('../../config/database.js');
const Alert   = require('../../config/alert.js');

const codeLength = 8;

router.post('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	let alert = null;
	if (typeof req.body.code !== 'undefined' && req.body.code.length === codeLength) {
		const code = {
			code: req.body.code,
			date: new Date(),
			school: req.body.school
		};
		data.db.loginCodes.find(function (err, codes) {
			var exists = codes.find(function (c) {
				return c.code == code.code;
			});
			if (typeof exists === 'undefined') {
				data.db.loginCodes.insert(code, function (err, result) {
					if (err) {
						console.log(err);
						const alertMessage = "Failed to insert to database.<br>" + err;
						alert            = new Alert(false, alertMessage);
					} else {
						alert = new Alert(true, "The login code was successfully added");
					}
					alert.passToNextPage(req);
					res.redirect('/options');
				});
			} else {
				alert = new Alert(false, "The login code already exists");
				alert.passToNextPage(req);
				res.redirect('/options');
			}
		});
	}
	else {
		alert = new Alert(false, "Code should be 8 characters long");
		alert.passToNextPage(req);
		res.redirect('/options');
	}
});

router.get('/loginCode', function (req, res) {
	const codeParam = req.param('code');
	data.db.loginCodes.find(function (err, codes) {
		const loginCode = codes.find(function (c) {
			return c.code === codeParam;
		});
		if (typeof loginCode === 'undefined') {
			res.send(400);
		} else {
			res.send(loginCode.school);
		}

	});

});

router.delete('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
	data.db.loginCodes.remove({
		'_id': data.mongojs.ObjectId(req.param('id'))
	}, function (err, user) {
		if (err) res.send(400);
		res.send(200);
	});
});


module.exports = router;
