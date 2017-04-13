/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var gcs = require.main.require('./config/calendar/googleCalendarService')(googleapis, googleAuth);
var gct = require.main.require('./config/calendar/googleCalendarTools')(gcs);
var clientAccount = require.main.require('./config/calendar/clientAccount.json');
var serviceAccount = require.main.require('./config/calendar/serviceAccount.json');
var calendarService = require.main.require('./config/calendar/calendarService.json');
var calendarEvent = require.main.require('./config/calendar/calendarEvent.json');


var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar = googleapis.calendar('v3');
var jwt = gcs.authorizeOAuth2Client(gcs.getServiceAccountJWT(serviceAccount.client_email, serviceAccount.private_key), oauth2Client);

exports.insertCalendarEvent = function (summary, ssid, location, startDateTime, endDateTime) {
    calendarEvent['summary'] = summary;
    calendarEvent['extendedProperties'].shared.ssid = ssid;
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
                    exports.insertCalendarEvent(summary, ssid, location, startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            }
        } else {
            console.log('Event ' + summary + ' inserted');
            return event;
        }
    });
}

exports.listCalendarEvents = function (startDateTime, endDateTime, callback) {
    gcs.listCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDateTime, endDateTime, function(err, data) {
        if (err) {
            console.log('The API said: ' + err);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    console.log("Reauthorized, trying again...");
                    exports.listCalendarEvents(startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            }
        } else {
            callback(data.items);
        }
    });
}

exports.listCalendarWeekEvents = function (week, callback) {
    gct.getWeekEvents(week, exports.listCalendarEvents, function(data) {
        callback(JSON.stringify(data));
    });
}
