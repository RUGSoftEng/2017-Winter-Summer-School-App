var express = require('express');
var router = express.Router();
var data = require('../../../config/database.js');
	
router.get('/announcepage',data.isLoggedIn,function(req,res){
    var user;
    if (req.user === undefined){
          user = "tester";
      }
      else {
        user = req.user
    }
      data.db.announcements.find(function(err,docs){
        res.render('announcements.ejs',{
            user: user,
            announcements: docs
        });
      });
});

module.exports = router;
	
 
