var express = require('express');
var router = express.Router();
var data = require('../../../config/database.js');
	
router.get('/lecturerpage', data.isLoggedIn,function(req,res){
    var user;
    if (req.user === undefined){
        user = "tester";
    }
    else {
        user = req.user
    }
      data.db.lecturers.find(function(err,docs){
        res.render('lecturerpage.ejs',{
            user: user,
            lecturers: docs
        });
      });
});

module.exports = router;
	
 
