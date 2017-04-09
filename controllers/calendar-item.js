var express = require('express');
var router = express.Router();
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var gcs = require('../config/calendar/googleCalendarService')(googleapis, googleAuth);
var gct = require('../config/calendar/googleCalendarTools')(gcs);
var clientAccount = require('../config/calendar/clientAccount.json');
var serviceAccount = require('../config/calendar/serviceAccount.json');
var calendarService = require('../config/calendar/calendarService.json');
var calendarEvent = require('../config/calendar/calendarEvent.json');

var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar = googleapis.calendar('v3');
var jwt = gcs.authorizeOAuth2Client(gcs.getServiceAccountJWT(serviceAccount.client_email, serviceAccount.private_key), oauth2Client);

function insertCalendarEvent(summary, ssid, location, startDateTime, endDateTime) {
    calendarEvent['summary'] = summary;
    calendarEvent['extendedProperties'].shared.ssid = "ssid";
    calendarEvent['location'] = location;
    calendarEvent['start'].dateTime = startDateTime;
    calendarEvent['end'].dateTime = endDateTime;
    gcs.insertCalendarEvent(calendarEvent, calendar, calendarService.calendar_id, oauth2Client, function(err, event) {
        if (err) {
            console.log('The API said: ' + err);
            console.log('error code: ' + err.code);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    console.log('Reauthorized, trying again...');
                    insertCalendarEvent(summary, ssid, location, startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            }
        } else {
            console.log('Event ' + summary + ' inserted');
            return event;
        }
    });
}

function listCalendarEvents(startDateTime, endDateTime, callback) {
    gcs.listCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDateTime, endDateTime, function(err, data) {
        if (err) {
            console.log('The API said: ' + err);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    console.log("Reauthorized, trying again...");
                    listCalendarEvents(startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            }
        } else {
            callback(data.items);
        }
    });
}

function listCalendarWeekEvents(week, callback) {
    gct.getWeekEvents(week, listCalendarEvents, function(data) {
        callback(JSON.stringify(data));
    });
}

router.post('/calendar/event', function(request, response) {
    var summary = request.body.title;
    var location = "Nettelbosje 2, 9747 AC Groningen";
    var ssid = request.body.ssid;
    var start = request.body.date + 'T' + request.body.startHour + ':' + request.body.startMinute + ':00.000Z';
    var end = request.body.date + 'T' + request.body.endHour + ':' + request.body.endMinute + ':00.000Z';

    console.log("Posting event: " + summary + " for school " + ssid + " starting at " + start + " and ending at " + end);
    var event = insertCalendarEvent(summary, ssid, location, start, end);
    response.redirect('/main');
});

router.get('/calendar/event', function(request, response) {
    var params = request.query;
    if (params.hasOwnProperty('startDate') && params.hasOwnProperty('endDate')) {
        if (params.hasOwnProperty('week') && !isNaN(params.week)) {
            listCalendarWeekEvents(parseInt(params.week), function(data) {
                response.send(data);
            })
        } else {
            listCalendarEvents(params.startDate, params.endDate, function(data) {
                response.send(data);
            });
        }
    }
});

module.exports = router;
