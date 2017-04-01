var express = require('express');
var router = express.Router();
var data = require('../config/database.js');
	
router.get('/generalinfo',data.isLoggedIn,function(req,res){
      data.db.generalinfo.find(function(err,docs){
        res.render('generalinfo.ejs',{
            user: req.user,
            generalinfo: docs
        });
      });
});

module.exports = router;
	
 
