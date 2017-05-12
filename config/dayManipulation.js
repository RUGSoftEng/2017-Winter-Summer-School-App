var requireDir = require('require-dir');
var json = require.main.require('./config/getJSON.js');

exports.getWeekEvents = function(callback) {
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?week=' + 0 + '&extended=true',
        port: 8080,
        async: false,
        dataType: 'json'
    }, function(statusCode, data) {
        var result = null;
        if (data && data.error == null) {
            result = JSON.parse(data.data);
        }
        callback(result);
    });
}
