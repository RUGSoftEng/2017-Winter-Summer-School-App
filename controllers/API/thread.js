const express = require('express');
const router = express.Router();
const Forum = require('mongoose').model('forum');
const Comment = require('mongoose').model('comment');


router.post('/API/forum/thread', function (req, res) {
    var newThread = new Forum(req.body);
    newThread.save(function (err, result) {
        if (err) {
            res.status(201);
            res.send(err);
            console.log(err);
        } else {
            console.log(result);
            res.sendStatus(200);
        }
    });
});

router.delete('/API/forum/thread', function (req, res) {
    Forum.findOne({
            '_id': req.query.id
        }, function (err, thread) {
            if (err) {
                res.status(201);
                res.send(err);
                console.log("error finding the thread with the id specified", err)
            }
            else {
                Comment.deleteMany({
                    '_id': {$in: thread.comments}
                }, function (err2) {
                    if (err2) {
                        res.status(201);
                        res.send(err2);
                        console.log("error deleting the comments associated with the thread", err2);
                    }
                    else {
                        Forum.findOneAndRemove({
                            '_id': req.query.id
                        }, function (err3) {
                            if (err) {
                                res.status(201);
                                res.send(err);
                                console.log("error deleting the thread", err)
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
    Forum.findOneAndUpdate({
        '_id': req.query.id
    }, {
        $set: {
            title: req.query.title,
            description: req.query.description,
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

router.get('/API/forum/thread', function (req, res) {
    Forum
        .find({})
        .sort({$natural: -1})
        .limit(req.query.count || 200)
        .exec(function (err, threads) {
            if (err) {
                res.status(201);
                res.send(err);
                console.log(err);
            }
            else {
                res.status(200);
                res.send(threads);
            }
        });
});
module.exports = router;
