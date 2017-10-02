var express           = require('express');
var router            = express.Router();
var ejs               = require('ejs');
var fs                = require('fs');
var schedule          = fs.readFileSync('./views/partials/schedule.ejs', 'ascii');
var restFunctions     = require('../../config/calendar/calendarRESTFunctions.js');
var verify            = require('../../config/verify.js');
var Alert             = require('../../config/alert.js');
var data              = require('../../config/database.js');

/**
* Handles incoming HTTP POST requests to '/calendar/event'. Attempts to process event details from
* the attached form in the body, and submit the event to the Google Calendar API. A success or
* fail message is then attached to the session object of the request to be displayed in the '/main'
* page upon redirect.
* @param {Object} request  - an object containing request details.
* @param {Object} response - an object to which a response may be written.
*/
router.post('/calendar/event', data.isAuthorised("ALTER_CALENDAR"), function (request, response) {
    var b = request.body;
    var required = [b.location,
             b.startDate,
             b.startHour,
             b.startMinute,
             b.endDate,
             b.endHour,
             b.endMinute,
             b.title,
             b.ssid,
             b.details];

    verify.getEmptyOrUndefinedStrings(required, function (undefOrEmpty) {
        if (undefOrEmpty.length > 0) {
            console.error("calendar-event.js: Not posting submitted event due to undefined fields!");
            response.redirect('/main');
        } else {
            var startDate = restFunctions.buildDateTime(b.startDate, b.startHour, b.startMinute);
            var endDate   = restFunctions.buildDateTime(b.endDate, b.endHour, b.endMinute);
            console.error('title = {' + b.title + '} and has length ' + b.title.length);
            console.error('location = {' + b.location + '} and has length ' + b.location.length);
            console.error('details = {' + b.details + '} and has length ' + b.details.length);
            var event     = restFunctions.insertCalendarEvent(
                b.title, b.ssid, b.location, b.details, startDate, endDate, function(err, data) {
                var a;
                if (err) {
                    a = new Alert(false, restFunctions.postErrorMessage(b.title, err.code, err.message));
                } else {
                    a = new Alert(true, restFunctions.postSuccessMessage(b.title, b.ssid));
                }
                a.passToNextPage(request);
                response.redirect('/main');
            });
        }
    });
});

/**
* Handles incoming HTTP PUT requests to '/calendar/event'. Attempts to process event details from
* the URL parameters, and submit the updated event to the Google Calendar API. A success error code
* is returned if no issues arise. Else, a response is written with the error object contained in
* the body.
* @param {Object} request  - an object containing request details.
* @param {Object} response - an object to which a response may be written.
*/
router.put('/calendar/event', data.isAuthorised("ALTER_CALENDAR"), function(request, response) {
    var p = request.query;
    var required = [p.id,
        p.title,
        p.location,
        p.details,
        p.startDate,
        p.startHour,
        p.startMinute,
        p.endDate,
        p.endHour,
        p.endMinute,
        p.ssid];

    verify.getEmptyOrUndefinedStrings(required, function(undefOrEmpty) {
        if (undefOrEmpty.length > 0) {
            var err = {'code': 400, 'message': 'Not updating submitted event due to undefined fields!'};
            response.writeHead(400, JSON.stringify({error: err}));
        } else {
            var startDate = restFunctions.buildDateTime(p.startDate, p.startHour, p.startMinute);
            var endDate   = restFunctions.buildDateTime(p.endDate, p.endHour, p.endMinute);
            var event     = restFunctions.updateCalendarEvent(
                p.id, p.title, p.ssid, p.location, p.details, startDate, endDate, function(err, data) {
                if (err) {
                    response.writeHead(409, JSON.stringify({error: err}));
                } else {
                    response.send(201);
                }
            });
        }
    });
});

/**
* Handles incoming HTTP GET requests to '/calendar/event'. Parses request parameters
* and determines what kind of data to return. Unless the 'rendered' parameter is
* specified, all data returned is in serialized JSON form: [(Date, [events]), ... ]
* The data and any error that occured are packaged in response: {error: err, data: data}
*
* PARAM: week=x
* Returns events for a week (Monday -> Friday). x = 0: current week,
* x > 0: 'x' weeks from now. x < 0: 'x' weeks ago. All other parameters
* are ignored except rendered.
*
* PARAM: rendered=true
* If specified alongside 'week=x', returns an HTML string containing
* the rendered schedule.ejs interface with the schedule data.
*
* PARAM: extended=true
* If specified alongside 'week=x', this parameter extends week events
* to span (Saturday -> Saturday).
*
* PARAM: startDate=x&endDate=y
* Returns events across the custom range of dates. Both 'x' and 'y'
* must be ISO-8601 compliant dateTime strings. Cannot be used with
* the 'rendered' parameter.
*
* @param {Object} request  - an object containing request details.
* @param {Object} response - an object to which a response may be written.
*/
router.get('/calendar/event', function(request, response) {
    var p           = request.query;
    var week        = p.hasOwnProperty('week') && !isNaN(p.week);
    var extended    = p.hasOwnProperty('extended') && p.extended == 'true';
    var rendered    = p.hasOwnProperty('rendered') && p.rendered == 'true';
    var startDate   = p.hasOwnProperty('startDate');
    var endDate     = p.hasOwnProperty('endDate');

    if (week) {
        restFunctions.listCalendarWeekEvents(parseInt(p.week), extended, function(err, data) {
            if (rendered) {
                request.session.week = parseInt(p.week);
                response.send(JSON.stringify(
                    {error: err,
                     data: ejs.render(schedule, {schedule: JSON.parse(data)})}));
            } else {
                response.send(JSON.stringify({error: err, data: data}));
            }
        });
    } else if (startDate && endDate && restFunctions.validDates([p.startDate, p.endDate])) {
        restFunctions.listCalendarEvents(p.startDate, p.endDate, function(err, data) {
            response.send(JSON.stringify({error: err, data: data}));
        });
    } else {
        var err = {'code': 400, 'message': 'Invalid parameters'};
        response.send(JSON.stringify({error: err}));
    }
});

/**
* Handles incoming HTTP DELETE requests to '/calendar/event'. Attempts to
* delete an event whose id matches that given in the request parameters.
* Returns a success code if the event could be deleted. Otherwise, an
* error object is returned.
* @param {Object} request  - an object containing request details.
* @param {Object} response - an object to which a response may be written.
*/
router.delete('/calendar/event', data.isAuthorised("ALTER_CALENDAR"), function(request, response) {
    var p = request.query;
    if (p.hasOwnProperty('id')) {
        restFunctions.deleteCalendarEvent(p.id, function(err) {
            if (err) {
                response.writeHead(400, JSON.stringify({error: err}));
            } else {
                response.send(200);
            }
        });
    } else {
        response.send(200);
    }
});

module.exports = router;
