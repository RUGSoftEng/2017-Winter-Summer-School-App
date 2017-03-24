var express = require('express');
var router = express.Router();
var data = require('../config/database.js');
	
router.get('/lecturerpage', data.isLoggedIn,function(req,res){
      data.db.lecturers.find(function(err,docs){
        res.render('lecturerpage.ejs',{
            user: req.user,
            lecturers: docs
        });
      });
});

module.exports = router;
	
 
