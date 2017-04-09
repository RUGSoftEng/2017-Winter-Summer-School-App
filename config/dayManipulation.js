var requireDir = require('require-dir');
var json = require.main.require('./config/getJSON.js');

exports.getMonday = function(d) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
}

exports.fillWeek = function(result, startDate, i, callback) {
    if (i == 7) {
        callback();
        return;
    } else {
        var tomorrow = new Date(startDate);
        tomorrow.setDate(startDate.getDate() + 1);
        json.getJSON({
            type: 'GET',
            path: '/calendar/event?startDate=' + startDate.toISOString() + '&endDate=' + tomorrow.toISOString(),
            host: 'localhost',
            port: 8080,
            async: false,
            dataType: 'json'
        }, function(statusCode, res) {
            result[i] = res;
            exports.fillWeek(result, tomorrow, i + 1, callback);
        });
    }

}