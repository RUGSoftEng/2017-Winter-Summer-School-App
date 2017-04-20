/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var gcs = require.main.require('./config/calendar/googleCalendarService')(googleapis, googleAuth);
var gct = require.main.require('./config/calendar/googleCalendarTools')(gcs);
var cache = require.main.require('./config/calendar/eventCache')(4);
var clientAccount = require.main.require('./config/calendar/clientAccount.json');
var serviceAccount = require.main.require('./config/calendar/serviceAccount.json');
var calendarService = require.main.require('./config/calendar/calendarService.json');
var calendarEvent = require.main.require('./config/calendar/calendarEvent.json');


var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar = googleapis.calendar('v3');
var jwt = gcs.authorizeOAuth2Client(gcs.getServiceAccountJWT(serviceAccount.client_email, serviceAccount.private_key), oauth2Client);

/* Configures the default calendar event object with the supplied parameters */
configureEvent = function(summary, ssid, location, startDateTime, endDateTime) {
    calendarEvent['summary'] = summary;
    calendarEvent['extendedProperties'].shared.ssid = ssid;
    calendarEvent['location'] = location;
    calendarEvent['start'].dateTime = startDateTime;
    calendarEvent['end'].dateTime = endDateTime;
}

/* Performs an API call to insert an event into the calendar. Attempts reauthorize on token expiration.
    If another error is encountered, it logs to console and returns an empty JSON object. */
exports.insertCalendarEvent = function (summary, ssid, location, startDateTime, endDateTime) {
    configureEvent(summary, ssid, location, startDateTime, endDateTime);
    gcs.insertCalendarEvent(calendarEvent, calendar, calendarService.calendar_id, oauth2Client, function(err, event) {
        if (err) {
            console.log('API Error: ' + err + '\nCode: ' + err.code);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    console.log('Reauthorized, trying again...');
                    exports.insertCalendarEvent(summary, ssid, location, startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            } else {
                return {};
            }
        } else {
            console.log('Event ' + summary + ' inserted');
            cache.flush();
            return event;
        }
    });
}

/* Performs an API call to extract and return a list of events from the calendar between the supplied dates.
 * Attempts to reauthorize on token expiration. If another error is encountered, it logs to console, and
 * returns an empty JSON string.
 * JSON format: { e1, e2, ... ei }, for all events [1..i]
 */
exports.listCalendarEvents = function (startDateTime, endDateTime, callback) {
    gcs.listCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDateTime, endDateTime, function(err, data) {
        if (err) {
            console.log('API Error: ' + err + '\nCode: ' + err.code);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    console.log("Reauthorized, trying again...");
                    exports.listCalendarEvents(startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            } else {
                return '{}';
            }
        } else {
            callback(data.items);
        }
    });
}

var lastGot = 0;
/* Invokes the getWeekEvents function of the googleCalendarTools module to extract events for a given week parameter.
 * returns a JSON string of the extracted events, or an empty string of events per day if an error was encountered.
 * JSON format: { {Date, [e1, ... , e1i]}, {Date, [e2, ... , e2i]}, ... }
 */
exports.listCalendarWeekEvents = function (week, callback) {
    cache.get(week, function(data) {
        if (data != null) {
            callback(data);
        } else {
            gct.getWeekEvents(week, exports.listCalendarEvents, function(data) {
                cache.cache(week, JSON.stringify(data));
                callback(JSON.stringify(data));
            });
        }
    });
}
