"use strict";

const router = require("express").Router();
const Comment = require("mongoose").model("comment");
const Thread = require("mongoose").model("thread");


router.post("/API/forum/comment", function (req, res, next) {
	const newComment = new Comment(req.body);
	newComment.save(function (err, result) {
		if (err) {
			err.apiCall = true;
			err.status = 400;
			next(err);
		} else {
			Thread.findById(req.body.parentThread, function (err2, thread) {
				if (err2 || !thread) {
					const errToSend = (err2 || new Error);
					errToSend.message = (err2 || "The thread you try to add a comment to, does not exist");
					errToSend.apiCall = true;
					errToSend.status = 400;
					next(errToSend);
				} else {
					thread.comments.push(result._id);
					thread.save(function (err3) {
						if (err3) {
							err3.apiCall = true;
							err3.status = 400;
							next(err3);
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
	Comment.findOne({ "_id": req.query.id }, function (err, comment, next) {
		if (err) {
			err.apiCall = true;
			err.status = 400;
			next(err);
		} else {
			Thread.findOneAndUpdate({ "_id": comment.parentThread },
				{ $pop: { "comments": req.query.id } },
				function (err2) {
					if (err2) {
						err2.apiCall = true;
						err2.status = 400;
						next(err2);
					} else {
						Comment.findOneAndRemove({ "_id": req.query.id }, function (err3) {
							if (err3) {
								err2.apiCall = true;
								err2.status = 400;
								next(err2);
							} else {
								res.sendStatus(200);
							}
						});
					}
				});
		}
	});

});

router.put("/API/forum/comment", function (req, res, next) {
	Comment.findOneAndUpdate({ "_id": req.query.id }, {
		$set: {
			text: req.query.text,
			edited: Date.now()
		}
	}, function (err) {
		if (err) {
			err.apiCall = true;
			err.status = 400;
			next(err);
		} else {
			res.sendStatus(200);
		}
	});
});

router.get("/API/forum/comment", function (req, res, next) {
	if (req.query.id) {
		req.query._id = req.query.id;
		delete req.query.id;
	}
	Comment
		.find(req.query)
		.exec(function (err, comment) {
			if (err) {
				err.apiCall = true;
				err.status = 400;
				next(err);
			} else {
				res.status(200);
				res.send(comment);
			}
		});
});


module.exports = router;
