var express = require('express');
var router  = express.Router();
var Comment = require('mongoose').model('comment');
var Forum = require('mongoose').model('forum');


router.post('/API/forum/comment',function (req, res) {
    var newComment = new Comment({
        text: req.body.text,
        author: req.body.author,
        posterID: req.body.posterID,
        imgURL:req.body.imgURL
    });
    newComment.save(function (err, result) {
        if (err) {
            res.status(201);
            res.send(err);
            console.log("error creating the comment",err);
        } else {
            Forum.findById(req.body.threadID,function(err2,thread){
                if(err2){
                    res.status(201);
                    res.send(err2);
                    console.log("error finding thread with the threadID in the request",err2);
                }
                else {
                    thread.comments.push(result._id);
                    thread.save(function(err3){
                        if(err3){
                            res.status(201);
                            res.send(err3);
                            console.log("error updating comment in thread array",err3);
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
    Comment.findOneAndRemove({
        '_id': req.param('id')
    }, function (err, user) {
        if (err){
            res.status(201);
            res.send(err);
            console.log(err)
        }
        else {
            res.send(200);
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
        if (err){
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
        .findOne({'_id':req.param('id')})
        .exec(function (err, comment) {
            if (err){
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