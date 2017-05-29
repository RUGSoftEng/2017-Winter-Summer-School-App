var express           = require('express');
var router            = express.Router();
var ejs               = require('ejs');
var fs                = require('fs');
var schedule          = fs.readFileSync('./views/partials/schedule.ejs', 'ascii');
var calendarFunctions = require.main.require('./config/calendar/calendarRESTFunctions.js');
var verify            = require.main.require('./config/verify.js');

/** Extracts information from post request to place on the calendar. Obtains event object if successful */
router.post('/calendar/event', function (request, response) {
    var b = request.body;
    verify.getUndefined([b.location, b.startDate, b.startHour, b.startMinute, b.endDate, b.endHour, b.endMinute, b.title, b.ssid, b.details], function (undef) {
        if (undef.length > 0) {
            console.error("calendar-event.js: Not posting submitted event due to undefined fields!");
        } else {
            var start = b.startDate + 'T' + b.startHour + ':' + b.startMinute + ':00' + calendarFunctions.getOffsetUTC();
            var end   = (b.endDate ? b.endDate : b.startDate) + 'T' + b.endHour + ':' + b.endMinute + ':00' + calendarFunctions.getOffsetUTC();
            console.log("Posting event: " + request.body.title + " for school " + b.ssid + " starting at " + start + " and ending at " + end);
            var event = calendarFunctions.insertCalendarEvent(b.title, b.ssid, b.location, b.details, start, end, function (err, data) {

            });
        }
    })
    response.redirect('/main');
});

/** Returns a serialized JSON object with an error object and an array of event tuples.
 * FORM: {error: <object>, data: <string>}
 * where data is a stringified JSON object. (So data must be parsed to be extracted)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *             Option                  Action                                          Cached
 *             ------                  ------                                          ------
 *            'week=(int)'             Specifies which week's events to return.        YES
 *                                     Current week = 0. Next = n. Last = -n.
 *                                     Data encoded [(Date, [events]), ... ].
 *                                     Ranges: (Monday -> Sunday)
 *
 *            'extended=true'          Returns events across an extended week.
 *                                     Ranges: (Saturday -> Saturday)                  YES
 *
 *            'rendered=true'          Returns events rendered into HTML object.
 *                                     For internal use only.                          YES
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  'startDate=(date)&endDate=(date)'  Returns events across a custom range.           NO
 *                                     Sorts events by day. Returns format:
 *                                     [(Date, [events]), ... ]
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *             Examples
 *             --------
 *             '/calendar/event/week=0'                    - Returns this week's events.
 *             '/calendar/event/week=-2&extended=true'     - Returns the extended week's events of
 *                                                           two weeks ago.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
router.get('/calendar/event', function (request, response) {
    var params        = request.query;
    var forWeek       = params.hasOwnProperty('week') && !isNaN(params.week);
    var extended      = params.hasOwnProperty('extended') && params.extended == 'true';
    var rendered      = params.hasOwnProperty('rendered') && params.rendered == 'true';
    var withStartDate = params.hasOwnProperty('startDate'), withEndDate = params.hasOwnProperty('endDate');

    if (forWeek) {
        calendarFunctions.listCalendarWeekEvents(parseInt(params.week), extended, function (err, data) {
            if (rendered) {
                response.send(JSON.stringify({error: err, data: ejs.render(schedule, {schedule: JSON.parse(data)})}));
            } else {
                response.send(JSON.stringify({error: err, data: data}));
            }
        });
    } else if (withStartDate && withEndDate) {
        calendarFunctions.listCalendarEvents(params.startDate, params.endDate, function (err, data) {
            response.send(JSON.stringify({error: err, data: data}));
        });
    }
});

module.exports = router;
