var requireDir = require('require-dir');
var json = require.main.require('./config/getJSON.js');

exports.getWeekEvents = function(callback) {
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?week=' + 0 + '&extended=true',
        port: 8080,
        async: false,
        dataType: 'json'
    }, function(statusCode, res) {
        callback(res);
    });
}
