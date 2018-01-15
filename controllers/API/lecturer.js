const router = require('express').Router();
const auth = require('../../config/lib/authorisation.js');
const multer = require('multer');
const crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');
const Lecturer = require('mongoose').model('lecturer');
const logger = require(process.cwd() + '/config/lib/logger');

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

router.delete('/API/lecturer', auth.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	//first get the document so you can delete the old picture path.
	Lecturer.findOneAndRemove({
		_id: req.param('id')
	}, function (err, user) {
		if (err) {
			logger.warning('Can not delete lecturer\n' + err);
			res.send(400);
		} else {
			if (user.imagepath) { // image is optional
				fs.unlink('.' + '/views/' + user.imagepath, function (err, result) {
					if (err) {
						logger.warning(err);
						res.send(400);
					} else {
						res.sendStatus(200);
					}
				});
			} else {
				res.sendStatus(200);
			}
		}
	});
});


router.post('/API/lecturer', upload.single('img[]'), auth.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	var newLecturer = new Lecturer({
		name: req.body.title,
		description: req.body.description,
		imagepath: typeof req.file !== "undefined" ? '/images/' + req.file.filename : undefined,
		website: req.body.website
	});
	newLecturer.save(function (err) {
		if (err) {
			logger.warning('Can not add new lecturer\n' + err);
		}
		res.redirect('/lecturerpage');
	});
});

router.put('/API/lecturer', auth.isAuthorised("ALTER_LECTURERS"), function (req, res) {
	Lecturer.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		name: req.param('title'),
		description: req.param('description'),
		imagepath: req.param('imagepath'),
		website: req.param('website')
	}, function (err) {
		if (err) {
			logger.warning('Can not edit lecturer\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});
});

router.get('/API/lecturer', function (req, res) {
	Lecturer
		.find({})
		.sort({ $natural: -1 })
		.limit(req.param('count') || 200)
		.exec(function (err, lecturers) {
			if (err) {
				logger.warning('Can retrieve lecturers\n' + err);
				res.send(400);
			} else res.send(lecturers);
		});

});


module.exports = router;
