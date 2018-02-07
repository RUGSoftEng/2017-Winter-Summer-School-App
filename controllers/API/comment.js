"use strict";

const router = require("express").Router();
const Comment = require("mongoose").model("comment");
const Thread = require("mongoose").model("thread");
const logger = require(process.cwd() + "/config/lib/logger");


router.post("/API/forum/comment", function (req, res) {
	const newComment = new Comment(req.body);
	newComment.save(function (err, result) {
		if (err) {
			res.status(400);
			res.send(err);
			logger.warning("Can't save the comment in the database " + err);
		} else {
			Thread.findById(req.body.parentThread, function (err2, thread) {
				if (err2 || !thread) {
					res.status(400);
					res.send(err2);
					logger.warning("Can't find the associated thread " + (err2 || "Threadid does not exist."));
				} else {
					thread.comments.push(result._id);
					thread.save(function (err3) {
						if (err3) {
							res.status(400);
							res.send(err3);
							logger.warning("Can't update the comment array of the associated thread ", err3);
						} else {
							res.sendStatus(200);
						}
					});
				}
			});
		}
	});

});

router.delete("/API/forum/comment", function (req, res) {
	Comment.findOne({"_id": req.query.id}, function (err, comment) {
		if (err) {
			res.status(400);
			res.send(err);
			logger.warning("Can't find comment with the specified id " + err);
		} else {
			Thread.findOneAndUpdate({"_id": comment.parentThread},
				{ $pop: { "comments": req.query.id } },
				function (err2) {
					if (err2) {
						res.status(400);
						res.send(err2);
						logger.warning("Can't update comment array of associated thread " + err2);
					} else {
						Comment.findOneAndRemove({"_id": req.query.id}, function (err3) {
							if (err3) {
								res.status(400);
								res.send(err3);
								logger.warning("Can't delete comment" + err3);
							} else {
								res.sendStatus(200);
							}
						});
					}
				});
		}
	});

});

router.put("/API/forum/comment", function (req, res) {
	Comment.findOneAndUpdate({"_id": req.query.id}, {
		$set: {
			text: req.query.text,
			edited: Date.now()
		}
	}, function (err) {
		if (err) {
			res.status(400);
			res.send(err);
			logger.warning("Can't edit comment " + err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get("/API/forum/comment", function (req, res) {
	req.query._id = req.query._id || req.query.id;
	Comment
		.find(req.query)
		.exec(function (err, comment) {
			if (err) {
				res.status(400);
				res.send(err);
				logger.warning("Can't get comment with specified id " + err);
			} else {
				res.status(200);
				res.send(comment);
			}
		});
});


module.exports = router;
