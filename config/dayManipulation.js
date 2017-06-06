var requireDir = require('require-dir');

var json = require('../config/getJSON.js');


exports.getWeekEvents = function (path, callback) {
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?week=' + 0 + '&extended=true',
        host: "localhost",
        port: "8800",
        async: false,
        dataType: 'json'
    }, function (statusCode, data) {
        var result = null;
        if (data && data.error == null) {
            result = JSON.parse(data.data);
        }
        callback(result);
    });
}
