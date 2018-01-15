const express = require('express');
const router = express.Router();
const Comment = require('mongoose').model('comment');
const Forum = require('mongoose').model('forum');


router.post('/API/forum/comment', function (req, res) {
	var newComment = new Comment(req.body);
	newComment.save(function (err, result) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log("error creating the comment", err);
		} else {
			Forum.findById(req.body.threadID, function (err2, thread) {
				if (err2) {
					res.status(201);
					res.send(err2);
					console.log("error finding thread with the threadID in the request", err2);
				}
				else {
					thread.comments.push(result._id);
					thread.save(function (err3) {
						if (err3) {
							res.status(201);
							res.send(err3);
							console.log("error updating comment in thread array", err3);
						}
						else {
							res.sendStatus(200);
						}
					});
				}
			});
		}
	});

});

router.delete('/API/forum/comment', function (req, res) {
	Comment.findOne({
		'_id': req.query.id
	}, function (err, comment) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log("error finding comment with the id provided", err)
		}
		else {
			Forum.findOneAndUpdate({
					'_id': comment.parentThread
				},
				{ $pop: { "comments": req.query.id } },
				function (err2) {
					if (err2) {
						res.status(201);
						res.send(err2);
						console.log("error finding the parent thread of the comment", err2)
					}
					else {
						Comment.findOneAndRemove({
							'_id': req.query.id
						}, function (err3) {
							if (err3) {
								res.status(201);
								res.send(err3);
								console.log("error deleting comment with specified id", err3)
							}
							else {
								res.sendStatus(200);
							}
						});
					}
				});
		}
	});

});

router.put('/API/forum/comment', function (req, res) {
	Comment.findOneAndUpdate({
		'_id': req.query.id
	}, {
		$set: {
			text: req.query.text,
			edited: Date.now()
		}
	}, function (err) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log(err);
		}
		else {
			res.sendStatus(200);
		}
	});
});
router.get('/API/forum/comment', function (req, res) {
	Comment
		.findOne({ '_id': req.query.id })
		.exec(function (err, comment) {
			if (err) {
				res.status(201);
				res.send(err);
				console.log(err);
			}
			else {
				res.status(200);
				res.send(comment);
			}
		});
});


module.exports = router;
