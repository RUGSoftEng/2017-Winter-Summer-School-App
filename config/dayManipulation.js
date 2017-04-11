var requireDir = require('require-dir');
var json = require.main.require('./config/getJSON.js');

exports.getWeekEvents = function(callback) {
    var date = "NULL";
    var week = 0;
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?startDate=' + date + '&endDate=' + date + "&week=" + week,
        host: 'localhost',
        port: 8080,
        async: false,
        dataType: 'json'
    }, function(statusCode, res) {
        callback(res);
    });
}
