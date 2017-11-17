var express = require('express');
var router = express.Router();
var data = require('../../config/database.js');
var Alert = require('../../config/alert.js');
var Announcement = require('mongoose').model('announcement');

router.put('/API/announcement', data.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
	// updates the description and title of an announcement
	// corresponding to the given id param.
	Announcement.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		$set: {
			title: req.param('title'),
			description: req.param('description')
		}
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});

});

router.delete('/API/announcement', data.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
	// deletes the announcements corresponding to the given id param
	Announcement.findOneAndRemove({
		'_id': data.mongojs.ObjectId(req.param('id'))
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});

});

router.post('/API/announcement', data.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
	var alert = null;
	new Announcement(req.body).save(function (err, result) {
		if (err) {
			console.log(err);
			alert = new Alert(false, "Failed to insert to database.<br>" + err);
		} else {
			alert = new Alert(true, "The announcement was successfully added");
			alert.passToNextPage(req);
		}
		alert.passToNextPage(req);
		res.redirect('/main');
	});

});

router.get('/API/announcement', function (req, res) {
	// retrieve a list of announcements
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
	const count = req.param('count') || 200;
	Announcement
		.find({})
		.sort({ $natural: -1 })
		.limit(count)
		.exec(function (err, announcements) {
			if (err) console.log(err);
			else res.send(announcements);
		});
});

module.exports = router;
