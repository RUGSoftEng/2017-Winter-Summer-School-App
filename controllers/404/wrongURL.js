module.exports = function(app) {
    // sends 404 for random urls
    app.use(function(req, res) {
        res.render('notFound.ejs');
    });

};

