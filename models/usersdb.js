
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Querystring = require('querystring');


exports.connect = function(callback) {
    mongoose.connect('mongodb://localhost/test');
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.setup = function(callback) { callback(null); }


var UsersSchema = new Schema({
    display_name : String,
    account: String,
    password:String,
    text:{type: String, default:""},
    create_date : { type: Date, default: Date.now}
});

var collectionName = 'users';
mongoose.model(collectionName, UsersSchema);
var User = mongoose.model(collectionName);

exports.add = function(rdata, callback) {
    var data = Querystring.parse(rdata);
    if(null != data)
    {
        console.log("try to add an new user.");
        var account = data["account"];
        var password = data["password"];
        var display_name = data["display_name"];

        console.log("try to add an new user,account=" + account);
        console.log("try to add an new user,password=" + password);
        console.log("try to add an new user, display_name=" + display_name);

        if(!account || !password)
        {
            console.log("Invalid params.");
            callback("Invalid params");
        }
        else
        {
            //check the account
            User.findOne({account:account},function(err, doc){
                var exist = false;
                if (err)
                {
                    console.log("check the account if exist, er=" + err);
                    callback("try again");
                }
                else
                {
                    console.log("account already exist, doc=" + doc);
                    if(null != doc)
                    {
                        console.log("account already exist");
                        exist = true;
                    }
                }

                if(true == Boolean(exist))
                {
                    callback("exist");
                }
                else
                {
                    console.log("try to add account.");
                    var newUser = new User();
                    newUser.account = account;
                    newUser.password = password;
                    newUser.display_name = display_name;
                    console.log("try to add an new user info =" + newUser.toString());
                    newUser.save(function(err){
                        console.log("response ." + err);
                        if(err){
                            callback(err);
                        }else{
                            callback(null, true);
                        }
                    });
                }
            });

        }
    }
    else
    {
        callback("Invalid params");
    }
}

exports.signin = function(rdata, callback)
{
    var data = Querystring.parse(rdata);
    if(!data)
    {
        callback("Invalid params");
    }
    else
    {
        var account = data["account"];
        var password = data["password"];
        if(!account || !password)
        {
            callback("Invalid account or password");
        }
        else
        {
            exports.findUserByAccount(account, function(err, doc)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    if(doc.password == password)
                    {
                        callback(null, true);
                    }
                    else
                    {
                        callback("Incorrect password");
                    }
                }
            });
        }

    }

}

exports.setpassword = function(rdata, callback)
{
    var data = Querystring.parse(rdata);
    if(!data)
    {
        callback("Invalid params");
    }
    else
    {
        var account = data["account"];
        var oldpassword = data["oldpassword"];
        var newpassword = data["newpassword"];
        if(!account || !oldpassword ||!newpassword)
        {
            callback("Invalid account or password value");
        }
        else
        {
            exports.findUserByAccount(account, function(err, doc)
            {
                if (err)
                {
                    callback(err);
                }
                else
                {
                    if(doc.password == oldpassword)
                    {
                        doc.password = newpassword;
                        doc.save(function(err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, true);
                            }
                        });
                    }
                    else
                    {
                        callback("Incorrect old password");
                    }
                }
            });
        }
    }
}


exports.updateByAccount = function(account, rdata, callback) {

    exports.findUserByAccount(account, function(err, doc)
    {
        if (err)
        {
            callback(err);
        }
        else
        {
            var data = Querystring.parse(rdata);
            if(null != data) {
                var text = data["text"];
                doc.text = text;
                doc.save(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, true);
                    }
                });
            }
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

exports.findUserById = function(id,callback){
    console.log("enter findUserById,id=" + id);
    User.findOne({id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}

exports.findUserByAccount = function(account,callback){
    console.log("enter findUserByAccount, account=" + account);
    User.findOne({account:account},function(err, doc){
        if (err) {
            //util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}

exports.findUserByDisplayName = function(name, callback){
    console.log("enter findUserByName, displayname=" + name);
    User.findOne({display_name:name},function(err, doc){
        if (err) {
            //util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
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