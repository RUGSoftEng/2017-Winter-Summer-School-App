const express = require('express');
const router = express.Router();
const data = require('../../config/database.js');
const Alert = require('../../config/alert.js');
var mongoose = require('mongoose');
var User = mongoose.model('account');

router.delete('/user', data.isAuthorised("ALTER_USERS"), function (req, res) {
	if (req.param('id') == req.user._id) {
		res.send(400);
	} else {
		User.findOneAndRemove({
			'_id': req.param('id')
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
	var newAccount = new User({
		username: req.body.username,
		password: req.body.password,
		rank: req.body.rank,
		school: req.body.school
	});
	newAccount.save(function (err, user) {
		let alert = null;
		if (err) {
			console.log(err);
			const alertMessage = "Failed to insert to database.<br>" + err;
			alert = new Alert(false, alertMessage);
			alert.passToNextPage(req);
		} else {
			alert = new Alert(true, "The announcement was successfully added");
			alert.passToNextPage(req);
		}

	});
	res.redirect('/options');
});


module.exports = router;
