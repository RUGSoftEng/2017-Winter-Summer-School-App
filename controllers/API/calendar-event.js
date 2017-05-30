var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var fs = require('fs');
var schedule = fs.readFileSync('./views/partials/schedule.ejs', 'ascii');
var calendarFunctions = require.main.require('./config/calendar/calendarRESTFunctions.js');
var verify = require.main.require('./config/verify.js');
var Alert = require.main.require('./config/alert.js');

/** Extracts information from post request to place on the calendar. Obtains event object if successful */
router.post('/calendar/event', function(request, response) {
    var b = request.body;
    verify.getUndefined([b.location, b.startDate, b.startHour, b.startMinute, b.endDate, b.endHour, b.endMinute, b.title, b.ssid, b.details], function(undef) {
        if (undef.length > 0) {
            console.error("calendar-event.js: Not posting submitted event due to undefined fields!");
            response.redirect('/main');
        } else {
            var start = b.startDate + 'T' + b.startHour + ':' + b.startMinute + ':00' + calendarFunctions.getOffsetUTC();
            var end = (b.endDate ? b.endDate : b.startDate) + 'T' + b.endHour + ':' + b.endMinute + ':00' + calendarFunctions.getOffsetUTC();
            console.log("Posting event: " + request.body.title + " for school " + b.ssid + " starting at " + start + " and ending at " + end);
            var event = calendarFunctions.insertCalendarEvent(b.title, b.ssid, b.location, b.details, start, end, function(err, data) {
                var a;
                if (err) {
                    a = new Alert(false, 'The event "' + b.title + '" could not be submitted at this time. Receiving error ' + err.code + ': "' + err.message + '"');
                } else {
                    a = new Alert(true, 'The event "' + b.title + '" was successfully submitted for the "' + b.ssid + '" school!');
                }
                a.passToNextPage(request);
                console.log(a.message);
                response.redirect('/main');
            });
        }
    });
});

/** Extracts information from put request to edit an existing calendar event. */
router.put('/calendar/event', function(request, response) {
    var p = request.query;
    verify.getUndefined([p.id, p.title, p.location, p.details, p.startDate, p.startHour, p.startMinute, p.endDate, p.endHour, p.endMinute, p.ssid], function(undef) {
        if (undef.length > 0) {
            console.error("calendar-event.js: Not updating submitted event due to undefined fields!");
            response.writeHead(400, {'err': {'code': 400, 'message': 'Undefined parameters in the request options'}});
        } else {
            var start = p.startDate + 'T' + p.startHour + ':' + p.startMinute + ':00' + calendarFunctions.getOffsetUTC();
            var end = (p.endDate ? p.endDate : p.startDate) + 'T' + p.endHour + ':' + p.endMinute + ':00' + calendarFunctions.getOffsetUTC();
            console.log("Updating event: " + p.title + " for school " + p.ssid + " starting at " + start + " and ending at " + end);
            var event = calendarFunctions.updateCalendarEvent(p.id, p.title, p.ssid, p.location, p.details, start, end, function(err, data) {
                if (err) {
                    response.writeHead(409, {'err': err});
                } else {
                    response.send(201);
                }
            });
        }
    });
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
router.get('/calendar/event', function(request, response) {
    var p = request.query;
    var forWeek = p.hasOwnProperty('week') && !isNaN(p.week);
    var extended = p.hasOwnProperty('extended') && p.extended == 'true';
    var rendered = p.hasOwnProperty('rendered') && p.rendered == 'true';
    var withStartDate = p.hasOwnProperty('startDate'), withEndDate = p.hasOwnProperty('endDate');

    if (forWeek) {
        calendarFunctions.listCalendarWeekEvents(parseInt(p.week), extended, function(err, data) {
            if (rendered) {
                response.send(JSON.stringify({error: err, data: ejs.render(schedule, {schedule: JSON.parse(data)})}));
            } else {
                response.send(JSON.stringify({error: err, data: data}));
            }
        });
    } else if (withStartDate && withEndDate) {
        calendarFunctions.listCalendarEvents(p.startDate, p.endDate, function(err, data) {
            response.send(JSON.stringify({error: err, data: data}));
        });
    }
});

/** Attempts to delete an event for the given eventID */
router.delete('/calendar/event', function(request, response) {
    var p = request.query;
    console.log("calendar-event.js: received delete request!");
    if (p.hasOwnProperty('id')) {
        calendarFunctions.deleteCalendarEvent(p.id, function(err) {
            if (err) {
                response.writeHead(400, {'err': err});
            } else {
                response.send(200);
            }
        });
    }
    response.send(200);
});

module.exports = router;
