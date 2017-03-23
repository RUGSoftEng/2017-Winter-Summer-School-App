module.exports = function(app,db, passport, mongojs) {

	

    app.get('/', function(req, res) {
        if(req.isAuthenticated()) {
	   		res.redirect('/main');
   		} else {
	        res.render('file', {
	            message: req.flash('error')
	        });
        }
    });

    app.get('/main', isLoggedIn, function(req, res) {
        db.announcements.find(function (err,docs){
          db.generalinfo.find(function(err,docs2){
            res.render('loggedIn.ejs', {
                user: req.user,
                announcements: docs,
                generalinfo: docs2
          })
          });
        });
    });
    app.delete('/generalinfo/item', isLoggedIn, function(req,res){
		db.generalinfo.remove({'_id' : mongojs.ObjectId(req.param('id'))}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
    });
    
    app.put('/generalinfo/item', isLoggedIn, function(req,res){
		db.generalinfo.update({'_id' : mongojs.ObjectId(req.param('id'))},{title:req.param('title'), description:req.param('description')}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
    });
    
    app.put('/announcement/item', isLoggedIn, function(req,res){
		db.announcements.update({'_id' : mongojs.ObjectId(req.param('id'))},{title:req.param('title'), description:req.param('description')}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
    });
    
    
    app.delete('/announcement/item', isLoggedIn, function(req,res){
		db.announcements.remove({'_id' : mongojs.ObjectId(req.param('id'))}, function(err, user) {
			if(err) throw err;
			res.redirect('/main');
		});
        
    });

    app.get('/announcepage',isLoggedIn,function(req,res){
      db.announcements.find(function(err,docs){
        res.render('announcements.ejs',{
            user: req.user,
            announcements: docs
        });
      });
    });
    app.get('/generalinfo',isLoggedIn,function(req,res){
      db.generalinfo.find(function(err,docs){
        res.render('generalinfo.ejs',{
            user: req.user,
            generalinfo: docs
        });
      });
    });


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/', passport.authenticate('login', {
        successRedirect: '/main',
        failureRedirect: '/',
        badRequestMessage : 'Invalid username or password',
        failureFlash: true
    }));



    app.post('/announcement/item',function(req,res){
      var newAnnouncement = {
        title: req.body.title,
        description: req.body.description,
        poster: "Nikolas Hadjipanayi",
        date: new Date()
      }
      db.announcements.insert(newAnnouncement,function(err,result){
        if(err){
          console.log(err);
        }
        res.redirect('/main');
      });
    });

    app.post('/generalinfo/item',function(req,res){
      var newGeneralInfo = {
        title: req.body.title,
        description: req.body.description,
      }
      db.generalinfo.insert(newGeneralInfo,function(err,result){
        if(err){
          console.log(err);
        }
        res.redirect('/main');
      });
    });
	



    // sends 404 for random urls
    app.use(function(req, res) {
        res.render('notFound.ejs');
    });

};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
