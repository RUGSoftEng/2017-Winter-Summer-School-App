var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');

router.put('/announcement/item', data.isLoggedIn, function(req, res) {
    data.db.announcements.update({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, {
        title: req.param('title'),
        description: req.param('description')
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});


router.delete('/announcement/item', data.isLoggedIn, function(req, res) {
    data.db.announcements.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});

router.post('/announcement/item', data.isLoggedIn, function(req, res) {
    var newAnnouncement = {
        title: req.body.title,
        description: req.body.description,
        poster: "Nikolas Hadjipanayi",
        date: new Date()
    }
    data.db.announcements.insert(newAnnouncement, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/main');
    });
});

router.get('/announcement/item', function(req, res) {
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.announcements.find({}, {}, {
        limit: count
    }).sort({$natural:-1}, function(err, docs) {
    	if(err) console.log(err);
        else res.send(docs);
    });

});

module.exports = router;