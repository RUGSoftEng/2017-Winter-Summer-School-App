var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');
var Alert = require.main.require('./config/alert.js');

router.get('/options', data.isLoggedIn, function(req, res) {
	data.db.accounts.find(function(err, docs) {
	    res.render('options.ejs', {
	        user: req.user,
	        accounts: docs
	    });
	});
});

router.post('/options', data.isLoggedIn, function(req, res) {
    var newAccount = {
        username: req.body.username,
        password: req.body.password,
    }
    console.log(req.body.username);
    data.db.accounts.insert(newAccount, function(err, result) {
    	var alert = null;
        if (err) {
            console.log(err);
            var alertMessage = "Failed to insert to database.<br>" + err;
            alert = new Alert(false, alertMessage);
        } else {
        	console.log('nois');
            alert = new Alert(true, "The announcement was successfully added");
        }
        //alert.passToNextPage(req);
        res.redirect('/options');
    });
});


module.exports = router;
