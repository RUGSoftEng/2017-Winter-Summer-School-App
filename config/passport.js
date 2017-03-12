var LocalStrategy   = require('passport-local').Strategy;

// hard coded users
// TODO: encrypt this shit
var users = [{
	'_id' : 1,
	'username' : 'admin',
	'password' : 'admin'
}];



// expose this function to our app using module.exports
module.exports = function(passport) {
     
    
passport.use('login', new LocalStrategy(
    function (username, password, done) {
        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
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