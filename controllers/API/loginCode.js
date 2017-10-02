var express = require('express');
var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');

var codeLength = 8;

router.post('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
    var alert = null;
    if (typeof req.body.code !== 'undefined' && req.body.code.length === codeLength) {
        var code = {
            code: req.body.code,
            date: new Date()
        };
        data.db.loginCodes.find(function (err, codes) {
            var exists = codes.find(function (c) {
                return c.code == code.code;
            });
            if (typeof exists === 'undefined') {
                data.db.loginCodes.insert(code, function (err, result) {
                    if (err) {
                        console.log(err);
                        var alertMessage = "Failed to insert to database.<br>" + err;
                        alert            = new Alert(false, alertMessage);
                    } else {
                        alert = new Alert(true, "The login code was successfully added");
                    }
                    alert.passToNextPage(req);
                    res.redirect('/options');
                });
            } else {
                alert = new Alert(false, "The login code already exists");
                alert.passToNextPage(req);
                res.redirect('/options');
            }
        });
    }
    else {
        alert = new Alert(false, "Code should be 8 characters long");
        alert.passToNextPage(req);
        res.redirect('/options');
    }
});

router.get('/loginCode', function (req, res) {
    var count = parseInt((req.param('count') ? req.param('count') : 200));
    data.db.loginCodes.find({}, {}, {
        limit: count
    }).sort({$natural: -1}, function (err, docs) {
        if (err) console.log(err);
        else res.send(docs);
    });

});

router.delete('/loginCode', data.isAuthorised("ALTER_LOGIN_CODES"), function (req, res) {
    data.db.loginCodes.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function (err, user) {
        if (err) res.send(400);
        res.send(200);
    });
});


module.exports = router;
