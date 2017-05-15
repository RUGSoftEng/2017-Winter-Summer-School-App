var LocalStrategy = require('passport-local').Strategy;
var data = require.main.require('./config/database.js');

var User = data.db.collection('accounts')

module.exports = function(passport) {
    
	passport.use('login', new LocalStrategy(
	    function (username, password, done) {
	    	data.db.accounts.find(function(err, users) {
		        var user = users.find(function(user) {
			        return user.username === username;
		        }); 
		        if(typeof user != 'undefined' && user.password === password) {
			        return done(null, user);
		        } else {
			        return done(null, false, {"message": "Invalid username or password."});
	 	        }
	 	   });
 	        
	    })
	);

    passport.serializeUser(function(user, done) {
      console.log(user._id);
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
    	data.db.accounts.find(function(err, users) {
    		var user = users.find(function(user) {
			        return user._id == id;
		    }); 
		    if(typeof user === 'undefined') 
		    	console.log('Error in deserializing user');
		    	
        	done(null, user);
        });
    });
    
};