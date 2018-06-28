"use strict";

const router = require("express").Router();
const Thread = require("mongoose").model("thread");
const Comment = require("mongoose").model("comment");
const logger = require(process.cwd() + "/config/lib/logger");


router.post("/API/forum/thread", function (req, res, next) {
	const newThread = new Thread(req.body);
	newThread.save(function (err, result) {
		if (err) {
			err.status = 400;
			err.apiCall = true;
			next(err);
		} else {
			logger.warning(result);
			res.sendStatus(200);
		}
	});
});

router.delete("/API/forum/thread", function (req, res, next) {
	Thread.findOne({ "_id": req.query.id }, function (err, thread) {
		if (err) {
			err.status = 400;
			err.apiCall = true;
			next(err);
		} else {
			Comment.deleteMany({ "_id": { $in: thread.comments } }, function (err2) {
				if (err2) {
					err2.status = 400;
					err2.apiCall = true;
					next(err);
				} else {
					Thread.findOneAndRemove({ "_id": req.query.id }, function (err3) {
						if (err3) {
							err3.status = 400;
							err3.apiCall = true;
							next(err);
						} else {
							res.sendStatus(200);
						}
					});
				}
			});
		}
	}
	);
});

router.put("/API/forum/thread", function (req, res, next) {
	Thread.findOneAndUpdate({ "_id": req.query.id }, {
		$set: {
			title: req.query.title,
			description: req.query.description,
			edited: Date.now()
		}
	}, function (err) {
		if (err) {
			err.status = 400;
			err.apiCall = true;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get("/API/forum/thread", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	const count = parseInt(req.query.count);
	delete req.query.count;
	Thread
		.find(req.query)
		.sort({ $natural: -1 })
		.limit(count || 200)
		.exec(function (err, threads) {
			if (err) {
				err.status = 400;
				err.apiCall = true;
				next(err);
			} else {
				res.status(200);
				res.send(threads);
			}
		});
});

module.exports = router;
