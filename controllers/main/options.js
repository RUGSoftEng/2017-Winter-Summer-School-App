var express = require('express');

var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');
var bcrypt  = require('bcrypt-nodejs');

var saltRounds = 8;

router.get('/options',data.isLoggedIn, function (req, res) {
    var user;
    if (req.user === undefined){
        user = "tester";
    }
    else {
        user = req.user
    }
    var alert = new Alert();
    alert.initiate(req);
    data.db.accounts.find(function (err, docs) {
        data.db.loginCodes.find(function (err, docs2) {
            data.db.forum.find(function (err, docs3) {
                res.render('options.ejs', {
                    user: user,
                    accounts: docs,
                    loginCodes: docs2,
                    forum: docs3,
                    alert: alert
                });
            });
        });
    });
});
router.post('/options',data.isLoggedIn, function (req, res) {
    bcrypt.hash(req.body.password, bcrypt.genSaltSync(saltRounds), null, function (err, hash) {
        var newAccount = {
            username: req.body.username,
            password: hash
        };
        data.db.accounts.find(function (err, users) {
            var alert = null;
            var user  = users.find(function (user) {
                return user.username == newAccount.username;
            });
            if (typeof user === 'undefined') {
                if(newAccount.username.length >= 5) {
                    data.db.accounts.insert(newAccount, function (err, result) {

                        if (err) {
                            console.log(err);
                            var alertMessage = "Failed to insert to database.<br>" + err;
                            alert            = new Alert(false, alertMessage);
                            alert.passToNextPage(req);
                        } else {
                            alert = new Alert(true, "The announcement was successfully added");
                            alert.passToNextPage(req);
                        }

                    });
                } else {
                    alert = new Alert(false, "Username is too short");
                    alert.passToNextPage(req);
                }
            } else {
                alert = new Alert(false, "Chosen username is already in use");
                alert.passToNextPage(req);
            }

            res.redirect('/options');

        });
    });
});


module.exports = router;
