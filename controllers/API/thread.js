var express = require('express');
var router = express.Router();
var Forum = require('mongoose').model('forum');

router.post('/API/forum/thread',function (req, res) {
    var newThread = new Forum({
        title: req.body.title,
        description: req.body.description,
		author: req.body.author,
        posterID: req.body.posterID,
        imgURL:req.body.imgURL
    });
    newThread.save(function (err, result) {
        if (err) {
            res.status(201);
            res.send(err);
            console.log(err);
        } else {
        	console.log(result);
        	res.send(200);
        }
	});
});

router.delete('/API/forum/thread', function (req, res) {
    Forum.findOneAndRemove({
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

router.put('/API/forum/thread', function (req, res) {
    Forum.findOneAndUpdate({
        '_id': req.param('id')
    }, {
        $set: {
            title: req.param('title'),
            description: req.param('description'),
            created: new Date(),
            edited: true
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

router.get('/API/forum/thread', function (req, res) {
    const count = parseInt((req.param('count') ? req.param('count') : 200));
    Forum
        .find({})
        .sort({ $natural: -1 })
        .limit(count)
        .exec(function (err, threads) {
            if (err){
                res.status(201);
                res.send(err);
                console.log(err);
            }
            else
                res.status(200);
                res.send(threads);
        });
});
module.exports = router;
