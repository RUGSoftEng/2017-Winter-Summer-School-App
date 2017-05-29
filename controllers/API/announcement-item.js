var express = require('express');

var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');
var multer  = require('multer');
var crypto  = require('crypto');
var mime    = require('mime');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/images/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload  = multer({storage: storage});

router.put('/announcement/item', data.isLoggedIn, function (req, res) {
    // updates the description and title of an announcement
    // corresponding to the given id param.
    data.db.announcements.update({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, {
        $set: {
            title: req.param('title'),
            description: req.param('description')
        }
    }, function (err, user) {
        if (err) throw err;
        res.send(200);
    });

});

router.delete('/announcement/item', data.isLoggedIn, function (req, res) {
    // deletes the announcements corresponding to the given id param
    data.db.announcements.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function (err, user) {
        if (err) throw err;
        res.send(200);
    });

});


router.post('/announcement/item', upload.single('img[]'), data.isLoggedIn, function (req, res) {
	// adds a new announcement
    var newAnnouncement;
    if(process.env.NODE_ENV === "test"){
        newAnnouncement = {
            title: req.body.title,
            description: req.body.description
        }
        res.send(newAnnouncement);
    }
    else{
        newAnnouncement = {
            title: req.body.title,
            description: req.body.description,
            poster: req.user.username,
            date: new Date()
        }
    data.db.announcements.insert(newAnnouncement, function (err, result) {
        var alert = null;
        if (err) {
            console.log(err);
            var alertMessage = "Failed to insert to database.<br>" + err;
            alert            = new Alert(false, alertMessage);
        } else {
            alert = new Alert(true, "The announcement was successfully added");
        }
        alert.passToNextPage(req);
        res.redirect('/main');
    }
    });
});

router.get('/announcement/item', function (req, res) {
    // retrieve a list of announcements
    // set the limit of query results to 200 by default
    // set it to the parameter count if it is provided
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.announcements.find({}, {}, {
        limit: count
    }).sort({$natural: -1}, function (err, docs) {
        if (err) console.log(err);
        else res.send(docs);
    });

});

module.exports = router;
