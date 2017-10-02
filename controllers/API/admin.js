var express = require('express');
var router  = express.Router();
var data    = require('../../config/database.js');
var Alert   = require('../../config/alert.js');

router.delete('/admin', data.isAuthorised("ALTER_ADMINS"), function (req, res) {
    if (req.param('id') == req.user._id) {
        res.send(400);
    } else {
        data.db.accounts.remove({
            '_id': data.mongojs.ObjectId(req.param('id'))
        }, function (err, user) {
            if (err) {
                res.send(400);
            } else {
                res.send(200);
            }
        });
    }
});


module.exports = router;
