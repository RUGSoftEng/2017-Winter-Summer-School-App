var express = require('express');
var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');
var Generalinfo = require('mongoose').model('generalinfo');

router.delete('/API/generalinfo', data.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndRemove({
		'_id': req.param('id')
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});

});

router.put('/API/generalinfo', data.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	Generalinfo.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		$set: {
			title: req.param('title'),
			description: req.param('description'),
			category: req.param('category'),
			date: new Date()
		}
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});

});


router.post('/API/generalinfo', data.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	const newGeneralInfo = new Generalinfo({
		title: req.body.title,
		description: req.body.description,
		date: new Date(),
		category: req.body.category
	});
	newGeneralInfo.save(function (err, result) {
		let alert = null;
		if (err) {
			alert = new Alert(false, "Failed to insert to database.<br>" + err);
			console.log(err);
		} else {
			alert = new Alert(true, "The general information was successfully added");
		}
		alert.passToNextPage(req);
		res.redirect('/main');
	});

});

router.get('/API/generalinfo', function (req, res) {
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
	const count = parseInt((req.param('count') ? req.param('count') : 200));
	Generalinfo
		.find({})
		.sort({ $natural: -1 })
		.limit(count)
		.exec(function (err, generalinfo) {
			if (err) console.log(err);
			else res.send(generalinfo);
		});
});

module.exports = router;
