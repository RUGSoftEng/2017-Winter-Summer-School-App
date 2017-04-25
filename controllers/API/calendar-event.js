var express = require('express');
var router = express.Router();
var calendarFunctions = require.main.require('./config/calendar/calendarRESTFunctions.js');


/* Extracts information from post request to place on the calendar. Obtains event object if successful */
router.post('/calendar/event', function(request, response) {
    var b = request.body;
    var location = "Nettelbosje 2, 9747 AC Groningen";
    var start = b.date + 'T' + b.startHour + ':' + b.startMinute + ':00.000Z';
    var end = b.date + 'T' + b.endHour + ':' + b.endMinute + ':00.000Z';

    console.log("Posting event: " + request.body.title + " for school " + b.ssid + " starting at " + start + " and ending at " + end);
    var event = calendarFunctions.insertCalendarEvent(b.title, b.ssid, location, start, end);
    response.redirect('/main');
});

/* Returns a JSON string of dates and their corresponding events for the encoded request of form:
 * /startDate=startDate&endDate=endDate&week=week where week is an optional parameter.
 */
router.get('/calendar/event', function(request, response) {
    var params = request.query;
    if (params.hasOwnProperty('week') && !isNaN(params.week)) {
        calendarFunctions.listCalendarWeekEvents(parseInt(params.week), function(data) {
            if (params.hasOwnProperty('rendered') && params.rendered == 'true') {
                response.render('partials/schedule.ejs', {schedule: JSON.parse(data)});
            } else {
                response.send(data);
            }
        });
    } else if (params.hasOwnProperty('startDate') && params.hasOwnProperty('endDate')) {
        calendarFunctions.listCalendarEvents(params.startDate, params.endDate, function(data) {
            response.send(data);
        });
    } else {
        console.error('calendar-event.js: received an invalid get request\n');
    }
});

module.exports = router;
