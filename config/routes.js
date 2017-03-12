module.exports = function(app,db, passport) {



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

    app.get('/announcepage',isLoggedIn,function(req,res){
      db.announcements.find(function(err,docs){
        res.render('announcements.ejs',{
            user: req.user,
            announcements: docs
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



    app.post('/announcement/add',function(req,res){
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

    app.post('/generalinfo/add',function(req,res){
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
