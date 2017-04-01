var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');

router.delete('/generalinfo/item', data.isLoggedIn, function(req, res) {
    data.db.generalinfo.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});

router.put('/generalinfo/item', data.isLoggedIn, function(req, res) {
    data.db.generalinfo.update({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, {
        title: req.param('title'),
        description: req.param('description')
    }, function(err, user) {
        if (err) throw err;
        res.redirect('/main');
    });

});

router.post('/generalinfo/item', function(req, res) {
    var newGeneralInfo = {
        title: req.body.title,
        description: req.body.description,
    }
    data.db.generalinfo.insert(newGeneralInfo, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/main');
    });
});

router.get('/generalinfo/item', function(req, res) {
    // set the limit of query results to 200 by default
    // set it to the parameter count if it is provided
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.generalinfo.find({}, {}, {
        limit: count
    }).sort({
        $natural: -1
    }, function(err, docs) {
        if (err) console.log(err);
        else res.send(docs);
    });
});

module.exports = router;