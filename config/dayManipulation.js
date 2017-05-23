var requireDir = require('require-dir');
var json = require.main.require('./config/getJSON.js');

exports.getWeekEvents = function(path,callback) {
    var hostname = path.split(':')[0];
    var port = path.split(':')[1];
    json.getJSON({
        type: 'GET',
        path: '/calendar/event?week=' + 0 + '&extended=true',
        host: hostname,
        port: port,
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
