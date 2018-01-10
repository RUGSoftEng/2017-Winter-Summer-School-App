var express = require('express');
var router  = express.Router();
var Comment = require('mongoose').model('comment');


router.post('/API/forum/comment',function (req, res) {
    const newComment = new Comment({
        text: req.body.text,
        author: req.body.author,
        posterID: req.body.posterID,
        imgURL:req.body.imgURL
    });
    newComment.save(function (err, result) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            //success update the thread with a new comment.
            console.log("created comment",result);
        }
    });

});