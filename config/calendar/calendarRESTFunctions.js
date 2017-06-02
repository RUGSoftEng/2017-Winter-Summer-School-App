/* Scope of all access to be performed */
/* Note: Had to "Share" the Calendar with the Google Service Account before it could be used */
var googleapis      = require('googleapis');
var googleAuth      = require('google-auth-library');
var gcs             = require('../calendar/googleCalendarService')(googleapis, googleAuth);
var gct             = require('../calendar/googleCalendarTools')(gcs);
var cache           = require('../calendar/eventCache.js')(8);
var clientAccount   = require('../calendar/clientAccount.json');
var serviceAccount  = require('../calendar/serviceAccount.json');
var calendarService = require('../calendar/calendarService.json');
var calendarEvent   = require('../calendar/calendarEvent.json');

/**
 * Initializes authenticated service account.
 */
var auth         = new googleAuth();
var oauth2Client = new auth.OAuth2();
var calendar     = googleapis.calendar('v3');
var calendarId   = calendarService.calendar_id;
var jwt          = gcs.authorizeOAuth2Client(
                   gcs.getServiceAccountJWT(serviceAccount.client_email,
                                            serviceAccount.private_key),
                                            oauth2Client);
var error        = null;

/**
* Returns an error string for a failure to submit an event.
* @param {String} summary        - the title/summary of the event.
* @param {Int}    errorCode      - the code given by the error object.
* @param {String} errorMessage   - the error message given by the error object.
*/
exports.postErrorMessage = function (summary, errorCode, errorMessage) {
    return 'The event "' + summary +
            '" could not be submitted at this time. Receiving error ' +
             errorCode + ': "' + errorMessage + '"';
}

/**
* Returns a success string for a successful event submission.
* @param {String} summary   - the title/summary of the event.
* @param {String} ssid      - the summer-school-id.
*/
exports.postSuccessMessage = function (summary, ssid) {
    return 'The event "' + summary + '" was successfully submitted for the "'
            + ssid + '" school!';
}

/**
 * Returns the UTC offset for the current time zone as a string.
 */
function getOffsetUTC () {
    var date       = new Date();
    var hourOffset = date.getTimezoneOffset() / 60;
    var sign       = (hourOffset > 0 ? '-' : '+');
    /* Correct orientation */
    return (Math.abs(hourOffset) > 10) ?
           (sign + Math.abs(hourOffset) + ':00') :
           (sign + '0' + Math.abs(hourOffset) + ':00');
}

/**
* Concatenates the given date and time into an RFC 3339 compliant string,
* then performs a time-zone adjustment (RFC 3339 is a profile of
* ISO-8601 with some subtle differences).
* @param {String} startDate     - a string representing the starting date.
* @param {String} startHour     - a string representing the starting hour.
* @param {String} startMinute   - a string representing the starting minute.
*/
exports.buildDateTime = function (startDate, startHour, startMinute) {
    var dateTime = startDate + 'T' + startHour + ':' + startMinute + ':00';
    return dateTime + getOffsetUTC();
}

/**
* Returns true if the supplied date strings can be parsed as RFC 3339
* Date objects.
* @param {String[]} dates     - a string of dates to check.
*/
exports.validDates = function (dates) {
    try {
        for (var i = 0; i < dates.count; i++) {
            var date = dates[i].toISOString();
        }
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Overwrites properties of the local JSON event template with the supplied arguments.
 * @param {String} id               - The event identifier.
 * @param {String} summary          - The event summary.
 * @param {String} ssid             - The summer-school-id.
 * @param {String} location         - An address for the event.
 * @param {String} startDateTime    - An ISO-8601 formatted dateTime string.
 * @param {String} endDateTime      - An ISO-8601 formatted dateTime string.
 */
function configureEvent (id, summary, ssid, location, description, startDateTime, endDateTime) {
    if (id) {
        calendarEvent['id'] = id;
    } else {
        if (calendarEvent.id) {
            delete calendarEvent.id;
        }
    }
    calendarEvent['summary']                        = summary;
    calendarEvent['extendedProperties'].shared.ssid = ssid;
    calendarEvent['location']                       = location;
    calendarEvent['description']                    = description;
    calendarEvent['start'].dateTime                 = startDateTime;
    calendarEvent['end'].dateTime                   = endDateTime;
}

/**
 * Performs a call to googleCalendarService module to insert an event.
 * Returns an event object if successful; else null.
 * @param {String}   summary        - The event summary.
 * @param {String}   ssid           - The summer-school-id
 * @param {String}   location       - An address for the event.
 * @param {String}   startDateTime  - An ISO-8601 formatted dateTime string.
 * @param {String}   endDateTime    - An ISO-8601 formatted dateTime string.
 * @param {Function} callback       - A callback executed on completion.
 *                                    Parameters are error object and event object.
 *                                    If error, event is null.
 */
exports.insertCalendarEvent = function (summary, ssid, location, description, startDateTime, endDateTime, callback) {
    configureEvent(null, summary, ssid, location, description, startDateTime, endDateTime);
    gcs.insertCalendarEvent(calendarEvent, calendar, calendarId, oauth2Client, function(err, data) {
        var event = null;
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (insertCalendarEvent): The Google API returned code ' +
             err.code + ' for error: ' + err);
        } else {
            cache.flush();
            event = data;
        }
        callback(err, event);
    });
}

/**
 * Performs a call to googleCalendarService module to update an event.
 * Returns an event object if successful; else null.
 * @param {String}   id             - The event id.
 * @param {String}   summary        - The event summary.
 * @param {String}   ssid           - The summer-school-id
 * @param {String}   location       - An address for the event.
 * @param {String}   startDateTime  - An ISO-8601 formatted dateTime string.
 * @param {String}   endDateTime    - An ISO-8601 formatted dateTime string.
 * @param {Function} callback       - A callback executed on completion.
 *                                    Parameters are error object and event object.
 *                                    If error, event is null.
 */
exports.updateCalendarEvent = function (id, summary, ssid, location, description, startDateTime, endDateTime, callback) {
    configureEvent(id, summary, ssid, location, description, startDateTime, endDateTime);
    gcs.updateCalendarEvent(calendarEvent, calendar, calendarId, oauth2Client, function(err, data) {
        var event = null;
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (updateCalendarEvent): The Google API returned code ' +
             err.code + ' for error: ' + err);
        } else {
            cache.flush();
            event = data;
        }
        callback(err, event);
    });
}

/**
 * Performs a call to googleCalendarService module to delete an event.
 * @param {String}   id         - The event id.
 * @param {Function} callback   - A callback executed on completion.
 *                                Parameters are an error object.
 *                                If no error, object is null.
 */
exports.deleteCalendarEvent = function(id, callback) {
    gcs.deleteCalendarEvent(id, calendar, calendarId, oauth2Client, function(err) {
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (deleteCalendarEvent): The Google API returned code ' +
            err.code + ' for error: ' + err);
        } else {
            cache.flush();
        }
        callback(err);
    });
}

/**
 * Performs a call to googleCalendarService module to fetch events between the provided dates.
 * Executes a callback with a custom JSON array of tuples containing a date and its corresponding
 * array of events if successful. Else returns a tuple with an error with an empty array.
 * @param {String}   startDateTime  - An ISO-8601 formatted dateTime string.
 * @param {String}   endDateTime    - An ISO-8601 formatted dateTime string.
 * @param {Function} callback       - A callback executed on completion.
 *                                    Parameters are error object and events object.
 *                                    If error not null, events is null.
 */
exports.getCalendarEvents = function (startDateTime, endDateTime, callback) {
    gcs.getCalendarEvents(calendar, calendarId, oauth2Client, startDateTime, endDateTime, function (err, data) {
        var events = null;
        if ((error = err) != null) {
            console.error('calendarRESTFunctions.js (getCalendarEvents): The Google API returned code ' +
            err.code + ' for error: ' + err);
        } else {
            events = data.items;
        }
        callback(err, events);
    });
}

/**
 * Performs a call to googleCalendarTools module to fetch events for the custom date range.
 * Uses googleCalendarService module to perform request. Executes a callback with an error object
 * and an events object. The events object is a JSON array of tuples containing a date and its
 * corresponding array of events. If an error occured, the events object is null.
 * Note: This function does not cache events, please do not use it unless necessary.
 * @param {String}   startDate      - An ISO-8601 formatted dateTime string.
 * @param {String}   endDate        - An ISO-8601 formatted dateTime string.
 * @param {Function} callback       - A callback executed on completion.
 *                                    Parameters are error object and events object.
 *                                    If error not null, events is null.
 */
exports.listCalendarEvents = function (startDate, endDate, callback) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    gct.getSortedWeekEvents(startDate, endDate,
    exports.getCalendarEvents, function (err, data) {
        var events = null;
        if ((error = err) != null) {
            callback(error, events);
        }
        events = JSON.stringify(data);
        callback(error, events);
    })
}

/**
 * Performs a call to googleCalendarTools module to fetch events for a week.
 * Uses googleCalendarService module to perform request. Executes a callback
 * with an error object and an events object. The events object is a JSON array
 * of tuples containing a date and its corresponding array of events.
 * If an error occured, the events object is null.
 * Note: This function caches events for faster response times.
 * @param {Int}      week       - An integer representing the current week offset.
 * @param {Boolean}  extended   - A boolean indicating whether or not to return
 *                                the extended week (Saturday -> Saturday).
 * @param {Function} callback   - A callback executed on completion.
 *                                Parameters are error object and events object.
 *                                If error not null, events is null.
 */
exports.listCalendarWeekEvents = function (week, extended, callback) {
    if (error) {
        /* Attempt to reauthorize */
        gcs.didReauthorizeOAuth2Client(jwt, oauth2Client, function (err) {
            if ((error = err) != null) {
                callback(error, null);
            } else {
                exports.listCalendarWeekEvents(week, extended, callback);
            }
        });
    } else {
        /* Fetch from cache if it exists, else retrieve */
        cache.get(week, function (data) {
            if (data != null) {
                var events = data.slice();
                callback(null,
                    JSON.stringify(extended ?
                        events.splice(0, 8) : events.splice(2, 7)));
            } else {
                gct.getExtendedWeekEvents(week,
                    exports.getCalendarEvents, function (err, data) {
                    var events = null;
                    if ((error = err) != null) {
                        callback(error, events);
                    } else {
                        cache.cache(week, data);
                        events = data.slice();
                        callback(error,
                            JSON.stringify(extended ?
                                events.splice(0, 8) : events.splice(2, 7)));
                    }
                });
            }
        });
    }
}
