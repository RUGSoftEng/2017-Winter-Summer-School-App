var express = require('express');
var router = express.Router();
var data = require('../config/database.js');
	
router.get('/announcepage',data.isLoggedIn,function(req,res){
      data.db.announcements.find(function(err,docs){
        res.render('announcements.ejs',{
            user: req.user,
            announcements: docs
        });
      });
});

module.exports = router;
	
 
