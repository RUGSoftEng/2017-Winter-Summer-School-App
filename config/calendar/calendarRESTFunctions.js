/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var gcs = require.main.require('./config/calendar/googleCalendarService')(googleapis, googleAuth);
var gct = require.main.require('./config/calendar/googleCalendarTools')(gcs);
<<<<<<< HEAD
var cache = require.main.require('./config/calendar/eventCache.js')(8);
=======
var cache = require.main.require('./config/calendar/eventCache')(4);
>>>>>>> development
var clientAccount = require.main.require('./config/calendar/clientAccount.json');
var serviceAccount = require.main.require('./config/calendar/serviceAccount.json');
var calendarService = require.main.require('./config/calendar/calendarService.json');
var calendarEvent = require.main.require('./config/calendar/calendarEvent.json');

/**
 * Initializes authenticated service account.
 */
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar = googleapis.calendar('v3');
var jwt = gcs.authorizeOAuth2Client(gcs.getServiceAccountJWT(serviceAccount.client_email, serviceAccount.private_key), oauth2Client);

<<<<<<< HEAD
/**
 * Overwrites properties of the local JSON event template with the supplied arguments.
 * @param {String} summary - The event summary.
 * @param {String} ssid - The summer-school-id
 * @param {String} location - An address for the event.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 */
function configureEvent (summary, ssid, location, startDateTime, endDateTime) {
=======
/* Configures the default calendar event object with the supplied parameters */
configureEvent = function(summary, ssid, location, startDateTime, endDateTime) {
>>>>>>> development
    calendarEvent['summary'] = summary;
    calendarEvent['extendedProperties'].shared.ssid = ssid;
    calendarEvent['location'] = location;
    calendarEvent['start'].dateTime = startDateTime;
    calendarEvent['end'].dateTime = endDateTime;
}


/**
 * Performs a call to googleCalendarService module to insert an event. Re-authenticates recursively if access-token rejected.
 * Returns an event object if successful; else null.
 * @param {String} summary - The event summary.
 * @param {String} ssid - The summer-school-id
 * @param {String} location - An address for the event.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 */
exports.insertCalendarEvent = function (summary, ssid, location, startDateTime, endDateTime) {
    configureEvent(summary, ssid, location, startDateTime, endDateTime);
    gcs.insertCalendarEvent(calendarEvent, calendar, calendarService.calendar_id, oauth2Client, function(err, event) {
        if (err) {
            console.error('calendarRESTFunctions.js (insertCalendarEvent): The Google API returned code ' + err.code + ' for error: ' + err);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    exports.insertCalendarEvent(summary, ssid, location, startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            } else {
                return null;
            }
        } else {
            console.log('calendarRESTFunctions: Inserted event: ' + summary + ' successfully.');
            cache.flush();
            return event;
        }
    });
}

/**
 * Performs a call to googleCalendarService module to fetch events between the provided dates. Re-authenticates recursively if access-token rejected.
 * Returns a raw array of JSON encoded events if successful. Else returns an empty array.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 */
exports.listCalendarEvents = function (startDateTime, endDateTime, callback) {
    gcs.listCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDateTime, endDateTime, function(err, data) {
        if (err) {
            console.error('calendarRESTFunctions.js (listCalendarEvents): The Google API returned code ' + err.code + ' for error: ' + err);
            if (gcs.isExpiredTokenError(err)) {
                gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(){
                    exports.listCalendarEvents(startDateTime, endDateTime); /* WARNING: Potential infinite loop */
                });
            } else {
                return '[]';
            }
        } else {
            callback(data.items);
        }
    });
}

/**
 * Performs a call to googleCalendarTools module to fetch events for a week (Defined as Saturday -> Saturday). Uses googleCalendarService module to perform
 * request. Returns a custom JSON array of tuples containing a date and its corresponding array of events if successful. Else returns an array of dates without
 * any events.
 * @param {Integer} week - An integer representing the current week offset.
 * @param {Function} callback - Callback function to execute upon completion.
 */
exports.listCalendarWeekEvents = function (week, callback) {
    cache.get(week, function(data) {
        if (data != null) {
            callback(data);
        } else {
            gct.getExtendedWeekEvents(week, exports.listCalendarEvents, function(data) {
                var serializedData = JSON.stringify(data);
                cache.cache(week, serializedData);
                callback(serializedData);
            });
        }
    });
}
