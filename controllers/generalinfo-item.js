var express = require('express');
var router = express.Router();
var data = require.main.require('./config/database.js');
	
router.delete('/generalinfo/item', data.isLoggedIn, function(req,res){
		data.db.generalinfo.remove({'_id' : data.mongojs.ObjectId(req.param('id'))}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
    });
    
router.put('/generalinfo/item', data.isLoggedIn, function(req,res){
		data.db.generalinfo.update({'_id' : data.mongojs.ObjectId(req.param('id'))},{title:req.param('title'), description:req.param('description')}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
});

router.post('/generalinfo/item', function(req,res){
      var newGeneralInfo = {
        title: req.body.title,
        description: req.body.description,
      }
      data.db.generalinfo.insert(newGeneralInfo,function(err,result){
        if(err){
          console.log(err);
        }
        res.redirect('/main');
      });
    });

module.exports = router;
