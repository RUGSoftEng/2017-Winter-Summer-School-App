exports.getUndefined = function (list, callback) {
    var undef = [];
    for (var i in list) {
        if (typeof(i) === 'undefined') {
            undef.push(i);
        }
    }
    callback(undef);
}
