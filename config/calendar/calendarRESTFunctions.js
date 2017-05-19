/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var gcs = require.main.require('./config/calendar/googleCalendarService')(googleapis, googleAuth);
var gct = require.main.require('./config/calendar/googleCalendarTools')(gcs);
var cache = require.main.require('./config/calendar/eventCache.js')(8);
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
var error = null;

/**
 * Overwrites properties of the local JSON event template with the supplied arguments.
 * @param {String} summary - The event summary.
 * @param {String} ssid - The summer-school-id
 * @param {String} location - An address for the event.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 */
function configureEvent (summary, ssid, location, description, startDateTime, endDateTime) {
    calendarEvent['summary'] = summary;
    calendarEvent['extendedProperties'].shared.ssid = ssid;
    calendarEvent['location'] = location;
    calendarEvent['description'] = description;
    calendarEvent['start'].dateTime = startDateTime;
    calendarEvent['end'].dateTime = endDateTime;
}

/**
 * Returns the UTC offset for the current time zone as a string.
 */
exports.getOffsetUTC = function() {
    var date = new Date();
    var hourOffset = date.getTimezoneOffset() / 60;
    var sign = (hourOffset > 0 ? '-' : '+'); /* Correct orientation */
    return (Math.abs(hourOffset) > 10) ? (sign + Math.abs(hourOffset) + ':00') : (sign + '0' + Math.abs(hourOffset) + ':00');
}

/**
 * Performs a call to googleCalendarService module to insert an event.
 * Returns an event object if successful; else null.
 * @param {String} summary - The event summary.
 * @param {String} ssid - The summer-school-id
 * @param {String} location - An address for the event.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 * @param {Function} callback - A callback executed on completion. Parameters are error object and event object. If error, event is null.
 */
exports.insertCalendarEvent = function (summary, ssid, location, description, startDateTime, endDateTime, callback) {
    configureEvent(summary, ssid, location, description, startDateTime, endDateTime);
    gcs.insertCalendarEvent(calendarEvent, calendar, calendarService.calendar_id, oauth2Client, function(err, data) {
        var event = null;
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (insertCalendarEvent): The Google API returned code ' + err.code + ' for error: ' + err);
        } else {
            console.log('calendarRESTFunctions.js (insertCalendarEvent): Inserted event: ' + summary + ' successfully.');
            cache.flush();
            event = data;
        }
        callback(err, event);
    });
}

/**
 * Performs a call to googleCalendarService module to remove an event.
 * Returns empty if successful, else an error.
 * @param {String} id - The event id.
 * @param {Function} callback - A callback executed on completion. Parameters are error object.
 */
exports.deleteCalendarEvent = function(id, callback) {
    gcs.deleteCalendarEvent(id, calendar, calendarService.calendar_id, oauth2Client, function(err) {
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (deleteCalendarEvent): The Google API returned code ' + err.code + ' for error: ' + err);
        } else {
            cache.flush();
            console.log('calendarRESTFunctions.js (deleteCalendarEvent): Deleted the event identified by id: ' + id + ' successfully.');
        }
        callback(err);
    })
}

/**
 * Performs a call to googleCalendarService module to fetch events between the provided dates.
 * Returns a custom JSON array of tuples containing a date and its corresponding array of events if successful. Else returns an empty array.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 * @param {Function} callback - A callback executed on completion. Parameters are error object and events object. If error, events is null.
 */
exports.getCalendarEvents = function (startDateTime, endDateTime, callback) {
    gcs.getCalendarEvents(calendar, calendarService.calendar_id, oauth2Client, startDateTime, endDateTime, function(err, data) {
        var events = null;
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (getCalendarEvents): The Google API returned code ' + err.code + ' for error: ' + err);
        } else {
            events = data.items;
        }
        callback(err, events);
    });
}

/**
 * Performs a call to googleCalendarTools module to fetch events for the custom date range. Uses googleCalendarService module to perform
 * request. Executes a callback with an error object and an events object. The events object is a JSON array of tuples
 * containing a date and its corresponding array of events. If an error occured, the events object is null.
 *
 * Note: This function does not cache events, please do not use it unless necessary.
 * @param {String} startDateTime - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime - An ISO-8601 formatted dateTime string.
 */
exports.listCalendarEvents = function (startDateTime, endDateTime, callback) {
    gct.getSortedWeekEvents(Date.parse(startDateTime), Date.parse(endDateTime), exports.getCalendarEvents, function(err, data) {
        var events = null;
        if ((error = err) != null) {
            callback(error, events);
        }
        events = JSON.stringify(data);
        callback(error, events);
    })
}

/**
 * Performs a call to googleCalendarTools module to fetch events for a week. Uses googleCalendarService module to perform
 * request. Executes a callback with an error object and an events object. The events object is a JSON array of tuples
 * containing a date and its corresponding array of events. If an error occured, the events object is null.
 *
 * Note: This function caches events for faster response times.
 * @param {Integer} week - An integer representing the current week offset.
 * @param {Boolean} extended - A boolean indicating whether or not to return the extended week (Saturday -> Saturday).
 * @param {Function} callback - Callback function to execute upon completion.
 */
exports.listCalendarWeekEvents = function (week, extended, callback) {
    if (error) {
        /* Attempt to reauthorize */
        gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function(err) {
            if ((error = err) != null) {
                callback(error, null);
            } else {
                exports.listCalendarWeekEvents(week, extended, callback);
            }
        });
    } else {
        /* Fetch from cache if it exists, else retrieve */
        cache.get(week, function(data) {
            if (data != null) {
                var events = data.slice();
                callback(null, JSON.stringify(extended ? events.splice(0,8) : events.splice(2,7)));
            } else {
                gct.getExtendedWeekEvents(week, exports.getCalendarEvents, function(err, data) {
                    var events = null;
                    if ((error = err) != null) {
                        callback(error, events);
                    } else {
                        cache.cache(week, data);
                        events = data.slice();
                        callback(error, JSON.stringify(extended ? events.splice(0,8) : events.splice(2,7)));
                    }
                });
            }
        });
    }
}
