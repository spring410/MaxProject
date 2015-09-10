/**
 * Created by sam on 9/10/2015.
 */
var db = require('mongoose');

exports.connect = function(callback) {
    db.connect('mongodb://localhost/test');
}

exports.disconnect = function(callback) {
    db.disconnect(callback);
}

exports.setup = function(callback) { callback(null); }

//exports.Schema = db.Schema;
exports.db = db;

