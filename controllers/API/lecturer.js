var express = require('express');

var router = express.Router();
var data = require('../../config/database.js');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');
var Lecturer = require('mongoose').model('lecturer');

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
var upload = multer({ storage: storage });

router.delete('/API/lecturer', data.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	//first get the document so you can delete the old picture path.
	Lecturer.findOneAndRemove({
		_id: req.param('id')
	}, function (err, user) {
		if (err) throw err;
		fs.unlink('.' + '/views/' + user.imagepath, function (err, result) {
			if (err) {
				console.log(err);
				res.send(400);
			}
		});
		res.send(200);
	});
});


router.post('/API/lecturer', upload.single('img[]'), data.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	var newLecturer = new Lecturer({
		name: req.body.title,
		description: req.body.description,
		imagepath: typeof req.file !== "undefined" ? '/images/' + req.file.filename : undefined,
		website: req.body.website
	});
	newLecturer.save(function (err, result) {
		if (err) {
			console.log(err);
		}
		res.redirect('/lecturerpage');
	});
});

router.put('/API/lecturer', data.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	Lecturer.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		name: req.param('title'),
		description: req.param('description'),
		imagepath: req.param('imagepath'),
		website: req.param('website')
	}, function (err, user) {
		if (err) throw err;
		res.send(200);
	});
});

router.get('/API/lecturer', function (req, res) {
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
	var count = parseInt((req.param('count') ? req.param('count') : 200));
	Lecturer
		.find({})
		.sort({ $natural: -1 })
		.limit(count)
		.exec(function (err, lecturers) {
			if (err) console.log(err);
			else res.send(lecturers);
		});

});


module.exports = router;
