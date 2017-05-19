var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');
var Alert = require.main.require('./config/alert.js');
var bcrypt = require('bcrypt');

var saltRounds = 8;

router.get('/options', data.isLoggedIn, function(req, res) {
	var alert = new Alert();
	alert.initiate(req);
	data.db.accounts.find(function(err, docs) {
	    res.render('options.ejs', {
	        user: req.user,
	        accounts: docs,
	        alert: alert
	    });
	});
});

router.post('/options', data.isLoggedIn, function(req, res) {
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		var newAccount = {
	        username: req.body.username,
	        password: hash,
	    }
	    data.db.accounts.find(function(err, users) {
	    		var alert = null;
	    		var user = users.find(function(user) {
				        return user.username == newAccount.username;
			    }); 
			    if(typeof user === 'undefined') {
				    data.db.accounts.insert(newAccount, function(err, result) {
				    	
				        if (err) {
				            console.log(err);
				            var alertMessage = "Failed to insert to database.<br>" + err;
				            alert = new Alert(false, alertMessage);
				            alert.passToNextPage(req);
				        } else {
				            alert = new Alert(true, "The announcement was successfully added");
				            alert.passToNextPage(req);
				        }
				        			        
				    });
				} else {
					alert = new Alert(false, "Chosen username is already in use");
					alert.passToNextPage(req);
				}
					
				res.redirect('/options');
	
		});
  	});
});


module.exports = router;
