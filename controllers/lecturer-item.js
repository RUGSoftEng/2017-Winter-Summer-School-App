var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/images/')},
    filename: function(req, file, cb) {
      crypto.pseudoRandomBytes(16, function(err, raw) {
          cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
  }
});

var upload = multer({ storage: storage });

router.put('/lecturer/item',data.isLoggedIn, function(req, res) {
    data.db.lecturers.update({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, {
        title: req.param('title'),
        description: req.param('description')
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});


router.delete('/lecturer/item', data.isLoggedIn, function(req, res) {
    data.db.lecturers.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});

router.post('/lecturer/item',upload.single('img[]'),data.isLoggedIn, function(req, res) {
    var newLecturer = {
        name: req.body.title,
        description: req.body.description,
        imagepath: '/images/placeholder.png'
    }
    if(typeof req.file != "undefined"){
      newLecturer.imagepath = '/images/' + req.file.filename ;
    }
    data.db.lecturers.insert(newLecturer, function(err, result) {
    if (err) {
        console.log(err);
    }
    res.redirect('/lecturerpage');
});

});

router.get('/lecturer/item', function(req, res) {
	// set the limit of query results to 200 by default
	// set it to the parameter count if it is provided
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.lecturers.find({}, {}, {
        limit: count
    }).sort({$natural:-1}, function(err, docs) {
    	if(err) console.log(err);
        else res.send(docs);
    });

});


module.exports = router;
