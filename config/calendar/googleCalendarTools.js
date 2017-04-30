module.exports = function(gcs) {

    var tools = {};

    /**
     * Returns the value of a day as: (365 * year + 31 * month + day)
     * @param {Date} d - The date.
     */
    tools.dayValue = function(d) {
        return (365 * d.getFullYear() + 31 * d.getMonth() + d.getDate());
    }

    /**
     * Returns the difference in days between two dates (a - b).
     * @param {Date} a - The first date.
     * @param {Date} b - The second date.
     */
    tools.dayDifference = function(a, b) {
        return ((a = tools.dayValue(a)) == (b = tools.dayValue(b))) ? 0 : a - b;
    }

    /**
     * Creates and returns an array composed of the zipped contents of the supplied arrays.
     * @param {Object[]} a - The first list.
     * @param {Object[]} b - The second list.
     * @param {function} f - The function which supplies the combined form of an a and b element.
     */
    tools.zipWith = function(a, b, f) {
        const r = [];
        const l = Math.min(a.length, b.length);
        for (var i = 0; i < l; i++) {
            r.push(f(a[i], b[i]));
        }
        return r;
    }

    /**
     * Creates and returns an array of Dates starting from 'start' and and extending 'count' days into the future.
     * @param {Date} start - The date to start from.
     * @param {Integer} count - The amount of days to extend to (including start).
     */
    tools.getDays = function(start, count) {
        var days = [start];
        for (var i = 1; i < count; i++) {
            days[i] = new Date(start.getTime());
            days[i].setDate(start.getDate() + i);
        }
        return days;
    }

    /**
     * Creates and returns a new Date instance containing the value of the last Monday. If it is Monday, the last Monday is today.
     * @param {Integer} offset - Optional offset in weeks. Supports both positive and negative values.
     */
    tools.getMonday = function(offset = 0) {
        var d = new Date();
        var t = d.getDate() - (d.getDay() == 0 ? 6 : d.getDay() - 1);
        d.setHours(0,0,0,0);
        d.setDate(t + offset * 7);
        return d;
    }

    /**
     * Creates and returns a new Date instance containing the value of the last Saturday. If it is Saturday, the last Saturday was last Saturday.
     * @param {Integer} offset - Optional offset in weeks. Supports both positive and negative values.
     * @param {Boolean} midnight - Sets the time to midnight if true. Else morning
     */
    tools.getSaturday = function(offset = 0, midnight) {
        var d = new Date();
        var t = d.getDate() - (d.getDay() == 0 ? 1 : (d.getDay() + 1));
        (midnight ? d.setHours(23,59,59,999) : d.setHours(0,0,0,0));
        d.setDate(t + offset * 7);
        return d;
    }

    /**
     * Creates and returns a new Date instance containing the value of the next Sunday. If it is Sunday, the next Sunday is today.
     * @param {Integer} offset - Optional offset in weeks. Supports both positive and negative values.
     */
    tools.getSunday = function(offset = 0) {
        var d = new Date();
        var t = d.getDate() + (7 - (d.getDay() == 0 ? 7 : d.getDay()));
        d.setHours(23,59,59,999);
        d.setDate(t + offset * 7);
        return d;
    }

    /**
     * Returns the events of a custom (startDay -> endDay) week separated by day. The result of this function is in form: [[Date,[Events]]]
     * @param {Date} startDay - The starting day of the week.
     * @param {Date} endDay - The ending day of the week.
     * @param {Integer} weekLength - The number of days in the week.
     * @param {Function} f - Function that will return the events for the supplied start and end date.
     * @param {Function} callback - The callback to be performed with the result.
     */
    tools.getCustomWeekEvents = function(startDay, endDay, weekLength, f, callback) {
        var weekDays = tools.getDays(startDay, weekLength);
        var weekEvents = Array(weekLength).fill().map(_ => []);
        var result;

        f (startDay.toISOString(), endDay.toISOString(), function(events) {
            var i, j;
            for (i = 0, j = 0; i < events.length; i++) {
                var d = new Date(events[i].start.dateTime);
                while (tools.dayDifference(weekDays[j], d) < 0) {
                    j++;
                }
                weekEvents[j].push(events[i]);
            }

            result = tools.zipWith(weekDays, weekEvents, function (d, e) {
                return [d,e];
            });

            return callback(result.map(function(x) {
                return [x[0].toISOString(), x[1]];
            }));
        });
    }

    /**
     * Returns the events of a week separated by day. The result of this function is in form: [[Date,[Events]]]
     * @param {Integer} offset - Optional offset in weeks. Supports both positive and negative values.
     * @param {Function} f - Function that will return the events for the supplied start and end date.
     * @param {Function} callback - The callback to be performed with the result.
     */
    tools.getWeekEvents = function (offset = 0, f, callback) {
        tools.getCustomWeekEvents(tools.getMonday(offset), tools.getSunday(offset), 7, f, callback);
    }

    /**
     * Returns the events of a custom (Saturday -> Saturday) week. The result of this function is in form: [[Date,[Events]]]
     * @param {Integer} offset - Optional offset in weeks. Supports both positive and negative values.
     * @param {Function} f - Function that will return the events for the supplied start and end date.
     * @param {Function} callback - The callback to be performed with the result.
     */
    tools.getExtendedWeekEvents = function (offset = 0, f, callback) {
        tools.getCustomWeekEvents(tools.getSaturday(offset, false), tools.getSaturday(offset + 1, true), 8, f, callback);
    }

    return tools;
}
