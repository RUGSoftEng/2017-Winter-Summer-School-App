const router = require('express').Router();
const Thread = require('mongoose').model('thread');
const Comment = require('mongoose').model('comment');
const logger = require(process.cwd() + '/config/lib/logger');


router.post('/API/forum/thread', function (req, res) {
	var newThread = new Thread(req.body);
	newThread.save(function (err, result) {
		if (err) {
			res.status(400);
			res.send(err);
			logger.warning("Can't add thread into the database " + err);
		} else {
			logger.warning(result);
			res.sendStatus(200);
		}
	});
});

router.delete('/API/forum/thread', function (req, res) {
	Thread.findOne({
			'_id': req.query.id
		}, function (err, thread) {
			if (err) {
				res.status(400);
				res.send(err);
				logger.warning("can't find the thread with the id specified ", err)
			}
			else {
				Comment.deleteMany({
					'_id': { $in: thread.comments }
				}, function (err2) {
					if (err2) {
						res.status(400);
						res.send(err2);
						logger.warning("can't delete the comments associated with the thread ", err2);
					}
					else {
						Thread.findOneAndRemove({
							'_id': req.query.id
						}, function (err3) {
							if (err3) {
								res.status(400);
								res.send(err3);
								logger.warning("can't delete the thread from the database ", err)
							}
							else {
								res.sendStatus(200);
							}
						})
					}
				});
			}
		}
	);
});

router.put('/API/forum/thread', function (req, res) {
	Thread.findOneAndUpdate({
		'_id': req.query.id
	}, {
		$set: {
			title: req.query.title,
			description: req.query.description,
			edited: Date.now()
		}
	}, function (err) {
		if (err) {
			res.status(400);
			res.send(err);
			logger.warning("can't edit the thread " + err);
		}
		else {
			res.sendStatus(200);
		}
	});
});

router.get('/API/forum/thread', function (req, res) {
	Thread
		.find({})
		.sort({ $natural: -1 })
		.limit(req.query.count || 200)
		.exec(function (err, threads) {
			if (err) {
				res.status(400);
				res.send(err);
				logger.warning("can't get the threads from the database " + err);
			}
			else {
				res.status(200);
				res.send(threads);
			}
		});
});

module.exports = router;
