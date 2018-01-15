const router = require('express').Router();
const Comment = require('mongoose').model('comment');
const Thread = require('mongoose').model('thread');


router.post('/API/forum/comment', function (req, res) {
	var newComment = new Comment(req.body);
	newComment.save(function (err, result) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log("error creating the comment", err);
		} else {
			Thread.findById(req.body.threadID, function (err2, thread) {
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
							res.send(200);
						}
					});
				}
			});
		}
	});

});

router.delete('/API/forum/comment', function (req, res) {
	Comment.findOne({
		'_id': req.param('id')
	}, function (err, comment) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log("error finding comment with the id provided", err)
		}
		else {
			Thread.findOneAndUpdate({
					'_id': comment.parentThread
				},
				{ $pop: { "comments": req.param('id') } },
				function (err2) {
					if (err2) {
						res.status(201);
						res.send(err2);
						console.log("error finding the parent thread of the comment", err2)
					}
					else {
						Comment.findOneAndRemove({
							'_id': req.param('id')
						}, function (err3) {
							if (err3) {
								res.status(201);
								res.send(err3);
								console.log("error deleting comment with specified id", err3)
							}
							else {
								res.send(200);
							}
						});
					}
				});
		}
	});

});

router.put('/API/forum/comment', function (req, res) {
	Comment.findOneAndUpdate({
		'_id': req.param('id')
	}, {
		$set: {
			text: req.param('text'),
			edited: Date.now()
		}
	}, function (err, user) {
		if (err) {
			res.status(201);
			res.send(err);
			console.log(err);
		}
		else {
			res.send(200);
		}
	});
});
router.get('/API/forum/comment', function (req, res) {
	Comment
		.findOne({ '_id': req.param('id') })
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
