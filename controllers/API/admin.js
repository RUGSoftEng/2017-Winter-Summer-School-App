var express = require('express');
var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');

router.delete('/admin',data.isLoggedIn,function (req, res) {
    data.db.accounts.remove({
        '_id': data.mongojs.ObjectId(req.param('id'))
    }, function (err, user) {
        if (err) {
            res.send(400);
        }
        res.send(200);
    });
});


module.exports = router;
