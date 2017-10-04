const express = require('express');
const router  = express.Router();
const data    = require('../../config/database.js');
const Alert   = require('../../config/alert.js');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 8;

router.delete('/user', data.isAuthorised("ALTER_USERS"), function (req, res) {
	if (req.param('id') == req.user._id) {
		res.send(400);
	} else {
		data.db.accounts.remove({
			'_id': data.mongojs.ObjectId(req.param('id'))
		}, function (err, user) {
			if (err) {
				res.send(400);
			} else {
				res.send(200);
			}
		});
	}
});


router.post('/user', data.isAuthorised("ALTER_USERS"), function (req, res) {
	bcrypt.hash(req.body.password, bcrypt.genSaltSync(saltRounds), null, function (err, hash) {
		console.log("shit");
		const newAccount = {
			username: req.body.username,
			password: hash,
			rank: req.body.rank
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
							const alertMessage = "Failed to insert to database.<br>" + err;
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
