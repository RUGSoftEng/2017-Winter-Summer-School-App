var express = require('express');

var router = express.Router();
var data = require('../../../config/database.js');
	
router.get('/generalinfo', data.isLoggedIn, function(req,res){
    var user;
    if (req.user === undefined){
        user = "tester";
    }
    else {
        user = req.user
    }
      data.db.generalinfo.find(function(err, docs){
        res.render('generalinfo.ejs',{
            user: user,

            generalinfo: docs
        });
    });
});

module.exports = router;
	
 
