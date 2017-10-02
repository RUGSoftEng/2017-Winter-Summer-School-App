const express = require('express');

const router = express.Router();
const data   = require('../../config/database.js');
const Alert  = require('../../config/alert.js');
const bcrypt = require('bcrypt-nodejs');

const saltRounds = 8;

router.get('/options', data.isAuthorised("VIEW_OPTIONS"), function (req, res) {
	const user = req.user || "";
	let alert = null;
	if(req.param('s') === 't') {
		alert = new Alert(true, "Succesfully added a school.");
	} else if(req.param('s') === 'f') {
		alert = new Alert(false, "Unable to add a school.");
	} else {
		alert = new Alert();
		alert.initiate(req);
	}
	data.db.accounts.find(function (err, docs) {
		data.db.loginCodes.find(function (err, docs2) {
			data.db.forum.find(function (err, docs3) {
				data.db.schools.find(function (err, docs4) {
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

router.post('/options', data.isAuthorised("ALTER_ADMINS"), function (req, res) {
	bcrypt.hash(req.body.password, bcrypt.genSaltSync(saltRounds), null, function (err, hash) {
		const newAccount = {
			username: req.body.username,
			password: hash
		};
		data.db.accounts.find(function (err, users) {
			let alert = null;
			const user  = users.find(function (user) {
				return user.username == newAccount.username;
			});
			if (typeof user === 'undefined') {
				if (newAccount.username.length >= 5) {
					data.db.accounts.insert(newAccount, function (err, result) {

						if (err) {
							console.log(err);
							var alertMessage = "Failed to insert to database.<br>" + err;
							alert            = new Alert(false, alertMessage);
							alert.passToNextPage(req);
						} else {
							alert = new Alert(true, "The announcement was successfully added");
							alert.passToNextPage(req);
						}

					});
				} else {
					alert = new Alert(false, "Username is too short");
					alert.passToNextPage(req);
				}
			} else {
				alert = new Alert(false, "Chosen username is already in use");
				alert.passToNextPage(req);
			}

			res.redirect('/options');

		});
	});
});


module.exports = router;
