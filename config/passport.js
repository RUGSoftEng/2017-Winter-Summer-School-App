var LocalStrategy = require('passport-local').Strategy;

// hard coded users
// TODO: encrypt this
var users = [
	{
		'_id' : 1,
		'username' : 'admin',
		'password' : 'admin'
	},
	{
		'_id' : 2,
		'username' : 'hello',
		'password' : 'bye'
	}
];

module.exports = function(passport) {
    
	passport.use('login', new LocalStrategy(
	    function (username, password, done) {
	        var user = users.find(function(user) {
		        return user.username === username;
	        }); 
	        if(typeof user != 'undefined' && user.password === password) {
		        return done(null, user);
	        } else {
		        return done(null, false, {"message": "Invalid username or password."});
 	        }
	    })
	);

    passport.serializeUser(function(user, done) {
      done(null, users[0]._id);
    });

    passport.deserializeUser(function(id, done) {
        done(null, users[0]);
    });
    
};