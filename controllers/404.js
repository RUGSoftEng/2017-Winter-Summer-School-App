var express = require('express');
var router = express.Router();

// sends 404 for random urls
router.get('/', function(req, res) {
	res.render('notFound.ejs');
});
    
module.exports = router;
