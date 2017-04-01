var express = require('express');
var router = express.Router();


var http = require('http');
var rr = require('request');
var bodyParser = require('body-parser');
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var googleCalendarService = require('../config/calendar/googleCalendarService')(googleapis, googleAuth);
var clientAccount = require('../config/calendar/clientAccount.json');
var serviceAccount = require('../config/calendar/serviceAccount.json');
var calendarService = require('../config/calendar/calendarService.json');
var sampleEvents = require('../config/calendar/sampleEvents.json');
var fs = require('fs');

/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */

/* ********** Init Client Account: Proxy for the Service Account ********** */
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar;

/* ********** Setup Service Account: Service account for the well... service ********** */
var jwt = googleCalendarService.getServiceAccountJWT(serviceAccount.client_email, serviceAccount.private_key);
googleCalendarService.authorizeOAuth2Client(jwt, oauth2Client);
calendar = googleapis.calendar('v3');

/* ********** Post an Event, and returns to caller: (Handled by the new module, but the template is modified here) ********** */

function postEvent(summary, startDateTime, endDateTime) {
    var eventTemplate = sampleEvents.coffeeEvent;
    eventTemplate['summary'] = summary;
    eventTemplate['start'].dateTime = startDateTime;
    eventTemplate['end'].dateTime = endDateTime;

    googleCalendarService.insertCalendarEvent(eventTemplate, calendar, calendarService.calendar_id, oauth2Client, function(err, event) {
        if (err) {
            console.log('The API said: ' + err);
        } else {
            return event;
        }
    });
}


router.post('/calendar/event', function(request, response) {
    var params = request.query;
    console.log("Posting event: " + params.summary + " starting at " + params.startDate + " and ending at " + params.endDate);
    if (params.summary && params.startDate && params.endDate) {
        var event = postEvent(params.summary, params.startDate, params.endDate);
        response.send(event);
    }
});

/* Returns a JSON list of events. Query format: /calendar/event?startDate=startDate&endDate=endDate */
router.get('/calendar/event', function(request, response) {
    var params = request.query;
    var startDate = params.startDate;
    endDate = params.endDate;

    if (endDate && startDate) {

        // console.log("Retrieving events from " + startDate + " through " + endDate);

        googleCalendarService.listCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDate, endDate, function(err, data) {
            if (err) {
                console.log("The API said: " + err);
                if (googleCalendarService.isBadRequestError(err)) {
                    console.log("The error occured due to a bad request!");
                }
                if (googleCalendarService.isExpiredTokenError(err)) {
                    console.log("The error is due to an expired token!");
                }
                return;
            } else {
                var upcomingEvents = data.items;
                console.log("There are " + upcomingEvents.length + " upcoming events.");
                for (var i = 0; i < upcomingEvents.length; i++) {
                    var e = upcomingEvents[i];
                    var start = e.start.dateTime || e.start.Date;
                    console.log('%s - %s', start, e.summary);
                }
                response.send(upcomingEvents);
            }
        });
    }
});


module.exports = router;