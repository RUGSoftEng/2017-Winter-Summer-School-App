module.exports = function(googleapis, googleAuth) {

    var services = {};

    /**
     * Creates and returns a new JSON Web Token (JWT) for the supplied Service Account.
     * @param {string} serviceAccountEmail - The email associated with the service account.
     * @param {string} serviceAccountPrivateKey - The private key of the service account.
     */
    services.getServiceAccountJWT = function(serviceAccountEmail, serviceAccountPrivateKey) {
        var scopes = ['https://www.googleapis.com/auth/calendar'];
        return new googleapis.auth.JWT(serviceAccountEmail, null, serviceAccountPrivateKey, scopes);
    }

    /**
     * Authorizes a JWT object and stores the returned access token in the oauth2Client object. Returns JWT object.
     * @param {jwt} jwt - The JSON Web Token associaed with the Service Account to be authorized.
     * @param {object} oauth2Client - The Oauth2 object to contain the access token.
     */
    services.authorizeOAuth2Client = function(jwt, oauth2Client) {
        jwt.authorize(function(err, result) {
            if (err) {
                console.log("[GoogleCalendarService] :: Failed to Authorize Service Account JWT: " + err);
            } else {
                oauth2Client.setCredentials({access_token: result.access_token});
            }
        });

        return jwt;
    }

    /**
     * Authorizes a JWT object and stores the returned access token in the oauth2Client object. Executes callback.
     * @param {jwt} jwt - The JSON Web Token associaed with the Service Account to be authorized.
     * @param {object} oauth2Client - The Oauth2 object to contain the access token.
     * @param {function} callback - The callback to execute.
     */
     services.didReauthorizeOAuth2Client = function(jwt, oauth2Client, callback) {
         jwt.authorize(function(err, result) {
             if (err) {
                 console.log("[GoogleCalendarService] :: Failed to Authorize Service Account JWT: " + err);
             } else {
                 oauth2Client.setCredentials({access_token: result.access_token});
                 callback();
             }
         });
     }

    /**
     * Attempts to insert a new Calendar event into the Calendar associated with the supplied Calendar Id.
     * @param {object} calendarEvent - The JSON formatted calendar event.
     * @param {object} calendar - The calendar object (googleapis.calendar).
     * @param {string} calendarId - The identifier for the given calendar.
     * @param {object} oauth2Client - The Oauth2 object containing the access token.
     * @param {function} callback - The callback function for the API.
     */
    services.insertCalendarEvent = function(calendarEvent, calendar, calendarId, oauth2Client, callback) {
        calendar.events.insert({
            auth: oauth2Client,
            calendarId: calendarId,
            resource: calendarEvent
        }, function(err, event) {
            callback(err, event);
        });
    }

    /**
     * Attempts to delete the event holding the supplied calendarEventId from the given calendar.
     * @param {string} calendarEventId - The identifier for the event.
     * @param {object} calendar - The calendar object (googleapis.calendar).
     * @param {string} calendarId - The identifier for the given calendar.
     * @param {object} oauth2Client - The Oauth2 object containing the access token.
     * @param {function} callback - The callback function for the API.
     */
    services.deleteCalendarEvent = function(calendarEventId, calendar, calendarId, oauth2Client, callback) {
        calendar.events.delete({
            auth: oauth2Client,
            calendarId: calendarId,
            eventId: calendarEventId
        }, function(err) {
            callback(err);
        });
    }

    /**
     * Attempts to fetch a list of calendar events from the given calendar.
     * @param {object} calendar - The calendar object (googleapis.calendar).
     * @param {string} calendarId - The identifier for the given calendar.
     * @param {object} oauth2Client - The Oauth2 object containing the access token.
     * @param {string} startDate - The date from which to begin retrieving. I.E: (new Date()).toISOString()
     * @param {int} endDate - The date from which to cutoff events.
     * @param {function} callback - The callback function for the API.
     */
    services.listCalendarEvents = function(calendar, calendarId, oauth2Client, startDate, endDate, callback) {
        calendar.events.list({
            auth: oauth2Client,
            calendarId: calendarId,
            timeMin: startDate,
            timeMax: endDate,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            callback(err, response);
        });
    }

    /**
     * Returns True if the given error object signals a bad request (data sent was formatted wrong).
     * @param {object} err - The error object returned from the API.
     */
    services.isBadRequestError = function(err) {
        return (err.code == 400);
    }

    /**
     * Returns True if the given error object signals an expired token.
     * @param {object} err - The error object returned from the API.
     */
    services.isExpiredTokenError = function(err) {
        return (err.code == 401);
    }

    return services;
}
