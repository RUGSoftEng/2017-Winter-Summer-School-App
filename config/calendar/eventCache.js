module.exports = function(cacheSize) {

    var cache = {};

    /* Contains both future and past events in the following schema:
     * if (week >= 0) then: index = 2 * week
     * if (week < 0)  then: index = 2 * |week| - 1
    */
    var array = [];

    /**
     * Empties the cache array
     */
    cache.flush = function(callback) {
        console.log("Flushed cache!");
        array = [];
    }

    /**
     * Returns events for the given week to the callback. Returns null if undefined
     * @param {Integer} week - The week to be checked.
     * @param {Function} callback - The callback to execute.
     */
     cache.get = function(week, callback) {
         if (week < 0) {
             callback((array[2 * Math.abs(week) - 1] == undefined) ? null : array[2 * Math.abs(week) - 1]);
         } else {
             callback((array[2 * week] == undefined) ? null : array[2 * week]);
         }
     }

     /**
      * Caches the given event for the week provided if enough room remains.
      * @param {Integer} week - The week to be cached.
      * @param {Object} events - The events object to be cached.
      */
      cache.cache = function(week, events) {
          if (array.length >= cacheSize) {
              cache.flush();
          }
          if (week < 0) {
              array[2 * Math.abs(week) - 1] = events;
          } else {
              array[2 * week] = events;
          }
      }

    return cache;
}
