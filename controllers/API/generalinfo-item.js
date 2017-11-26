var express = require('express');

var router  = express.Router();
var data    = require('../../config/database.js');
var multer  = require('multer');
var crypto  = require('crypto');
var mime    = require('mime');
var Alert   = require('../../config/alert.js');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './views/images/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
		});
	}
});
var upload  = multer({storage: storage});

router.delete('/generalinfo/item', data.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	data.db.generalinfo.remove({
		'_id': data.mongojs.ObjectId(req.param('id'))
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});

});

router.put('/generalinfo/item', data.isAuthorised("ALTER_GENERAL_INFO"), function (req, res) {
	data.db.generalinfo.update({
		'_id': data.mongojs.ObjectId(req.param('id'))
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


router.post('/generalinfo/item', data.isAuthorised("ALTER_GENERAL_INFO"), upload.single('img[]'), function (req, res) {
	const newGeneralInfo = {
		title: req.body.title,
		description: req.body.description,
		date: new Date(),
		category: req.body.category
	};
	data.db.generalinfo.insert(newGeneralInfo, function (err, result) {
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

router.get('/generalinfo/item', function (req, res) {
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
	const count = parseInt((req.param('count') ? req.param('count') : 200));
	data.db.generalinfo.find({}, {}, {
		limit: count
	}).sort({
		$natural: -1
	}, function (err, docs) {
		if (err) console.log(err);
		else res.send(docs);
	});
});

module.exports = router;
