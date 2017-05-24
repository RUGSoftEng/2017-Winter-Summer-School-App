var express = require('express');
var router  = express.Router();
var data    = require.main.require('./config/database.js');
var Alert   = require.main.require('./config/alert.js');


router.post('/loginCode', function (req, res) {
    var code = {
        code: req.body.code,
        date: new Date()
    };
    data.db.loginCodes.insert(code, function (err, result) {
        var alert = null;
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

});

router.get('/loginCode', function (req, res) {
    var code = {
        code: req.body.code,
        date: new Date()
    };
    data.db.loginCodes.insert(code, function (err, result) {
        var alert = null;
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

});


module.exports = router;
