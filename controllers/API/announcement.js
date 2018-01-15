const router = require('express').Router();
const auth = require('../../config/lib/authorisation.js');
const Announcement = require('mongoose').model('announcement');
const logger = require(process.cwd() + '/config/lib/logger');

router.put('/API/announcement', auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
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
		if (err) {
			logger.warning('Unable to edit announcement.\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});

});

router.delete('/API/announcement', auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
	// deletes the announcements corresponding to the given id param
	Announcement.findOneAndRemove({
		'_id': req.param('id')
	}, function (err) {
		if (err) {
			logger.warning('Unable to delete announcement.\n' + err);
			res.send(400);
		} else {
			res.send(200);
		}
	});

});

router.post('/API/announcement', auth.isAuthorised("ALTER_ANNOUNCEMENTS"), function (req, res) {
	new Announcement(req.body).save(function (err, result) {
		if (err) {
			logger.warning('Unable to post announcement.\n' + err);
		} else {
		}
		res.redirect('/main');
	});

});

router.get('/API/announcement', function (req, res) {
	Announcement
		.find({})
		.sort({ $natural: -1 })
		.limit(req.param('count') || 200)
		.exec(function (err, announcements) {
			if (err) {
				logger.warning('Can not retrieve announcements\n' + err);
				res.send(400);
			} else res.send(announcements);
		});
});

module.exports = router;
