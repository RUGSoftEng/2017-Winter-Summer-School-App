var express = require('express');
var router  = express.Router();
var data    = require('../../config/database.js');


router.post('/forum/thread/item', function (req, res) {
    // creates a new forum thread and inserts it in the database.
    var newThread;
    if (process.env.NODE_ENV === "test") {
        newThread = {
            title: req.body.title,
            description: req.body.description
        };
        res.send(newThread);
    }
    else {
        newThread = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            posterID: req.body.posterID,
            date: new Date(),
            imgurl : req.body.imgurl,
            comments: []
        };
        data.db.forum.insert(newThread, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send(200);
            }
            data.db.forum.insert(newThread, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(200);
                }
            });
        });
    }
});

router.post('/forum/comment/item', function (req, res) {
    // creates a new comment and adds it to the appropriate thread.
    var newComment = {
        author: req.body.author,
        posterID: req.body.posterID,
        date: new Date(),
        text: req.body.text,
        imgurl : req.body.imgurl
    };
    data.db.forum.update({
            '_id': data.mongojs.ObjectId(req.body.threadID)
        }, {
            $push: {
                comments: newComment
            }
        },
        function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.send(200)
            }
        });
});


router.put('/forum/thread/item', function (req, res) {
    // updates the description and title of a thread according to the id passed.
    data.db.forum.update({
        '_id': data.mongojs.ObjectId(req.param('threadID'))
    }, {
        $set: {
            title: req.param('title'),
            description: req.param('description')
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.send(200);
        }
    });
});

router.put('/forum/comment/item', function (req, res) {
    // updates the modifies the comment.
    //comment is selected by its position in the array.
    data.db.forum.findOne({
        _id: data.mongojs.ObjectID(req.param('threadID'))
    }, function(err, doc) {
        var array = doc.comments;
        var i = 0;
        var pos;
        for (;i< array.length;i++){
            if (array[i].commentID === req.param('commentID')){
                pos = i;
            }
        }
        console.log(pos);
        var update= {
            "$set": {}
        };
        update["$set"]["comments." + pos + ".text"] = req.param("text");
        data.db.forum.update({
            '_id': data.mongojs.ObjectId(req.param('threadID'))
        }, update, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.send(200);
            }
        });
    });
});


router.delete('/forum/thread/item', function (req, res) {
    // deletes the thread using the id.
    data.db.forum.remove({
        '_id': data.mongojs.ObjectId(req.param('threadID'))
    }, function (err, user) {
        if (err) throw err;
        res.send(200);
    });

});

router.delete('/forum/comment/item', function (req, res) {

    data.db.forum.update({
        '_id': data.mongojs.ObjectId(req.param('threadID'))
    }, {
        $pull: {
            comments: {commentID:req.param('commentID')}
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.send(200);
        }
    });
});

router.get('/forum/item', function (req, res) {
    // retrieve a list of announcements
    // set the limit of query results to 200 by default
    // set it to the parameter count if it is provided
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.forum.find({}, {}, {
        limit: count
    }).sort({
        $natural: -1
    }, function (err, docs) {
        if (err) console.log(err);
        else res.send(docs);
    });

});

module.exports = router;
