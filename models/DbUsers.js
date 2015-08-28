//var mongodb = require('./mongodb');
//var Schema = mongodb.mongoose.Schema;
//var UsersSchema = new Schema({
//    name : String,
//    email: String,
//    phone:String,
//    thirdparty:Number,
//    signuptype:Number,
//    signupdate:{ type: Date, default: Date.now},
//    sex:Number,
//    avatar:Number,
//    alias : [String],
//    publish : Date,
//    create_date : { type: Date, default: Date.now}
//});
//var Users = mongodb.mongoose.model("Users", UsersSchema);
//
//
//
//var UsersDAO = function(){};
//module.exports = new UsersDAO();

var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect('mongodb://localhost/test');
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.setup = function(callback) { callback(null); }

//定义todo对象模型
var UsersSchema = new Schema({
    id:Number,
    name : String,
    email: String,
    phone:String,
    thirdparty:Number,
    signuptype:Number,
    signupdate:{ type: Date, default: Date.now},
    sex:Number,
    avatar:Number,
    alias : [String],
    publish : Date,
    create_date : { type: Date, default: Date.now}
});

//访问todo对象模型
mongoose.model('users', UsersSchema);
var User = mongoose.model('users');

//exports.emptyNote = { "_id": "", author: "", note: "" };

exports.add = function(title,callback) {
    var newUser = new User();
    newUser.title = title;
    newUser.save(function(err){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            callback(null);
        }
    });

}

exports.delete = function(id, callback) {
    exports.findUserById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
}

exports.editTitle = function(id, title, callback) {
    exports.findUserById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.post_date = new Date();
            doc.title = title;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });
}
exports.editFinished = function(id, finished, callback) {
    exports.findUserById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.post_date = new Date();
            doc.finished = finished;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });
}

exports.find = function(callback) {
    User.find({}, callback);
}

exports.forAll = function(doEach, done) {
    User.find({}, function(err, docs) {
        if (err) {
            util.log('FATAL '+ err);
            done(err, null);
        }
        docs.forEach(function(doc) {
            doEach(null, doc);
        });
        done(null);
    });
}

var findUserById = exports.findUserById = function(id,callback){
    User.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}