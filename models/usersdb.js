
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Querystring = require('querystring');
var crypto_pwd = require('crypto');
var SecrectKey = "!@#imakeit123"
var tokenSecret = "token_!@#123";
var moment = require("moment");
var jwt = require('jwt-simple');


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


var TokensSchema = new Schema({
    token : String,
    account: String,
    create_date : {type: Date, default: Date.now},
    expire_date:  {type: Date, default: Date.now}
});
var TokenCollectionName = 'tokens';
mongoose.model(TokenCollectionName, UsersSchema);
var Tokens = mongoose.model(TokenCollectionName);

exports.add = function(rdata, callback) {
    var data = Querystring.parse(rdata);
    if(null != data)
    {
        console.log("try to add an new user.");
        var account = data.account;
        var password = data.password;
        var display_name = data.display_name;

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
                    var cipher  = crypto_pwd.createCipher('aes-256-cbc', SecrectKey)
                    var cryptedpwd = cipher.update(password, 'utf8','hex');
                    cryptedpwd += cipher.final('hex');
                    console.log("--pwd---:" + cryptedpwd);
                    //var decipher  = crypto_pwd.createDecipher('aes-256-cbc', SecrectKey)
                    //var decpwd = decipher.update(cryptedpwd, 'hex', 'utf8')
                    //decpwd += decipher.final('utf8');
                    //console.log("--pwdtext---:" + decpwd);
                    console.log("try to add account.");
                    newUser.password = cryptedpwd;
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

exports.signin = function(qdata, callback)
{
    var data = Querystring.parse(qdata);
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
                    console.log("--password---:" + password);
                    var decipher  = crypto_pwd.createDecipher('aes-256-cbc', SecrectKey)
                    var decpwd = decipher.update(doc.password, 'hex', 'utf8')
                    decpwd += decipher.final('utf8');
                    console.log("--pwdtext---:" + decpwd);

                    if(password == decpwd)
                    {
                        //succeed to sign in , and then return token
                        var expires = moment().add('days', 15).valueOf();
                        var token = jwt.encode({ account: account, exp:expires}, tokenSecret);
                        console.log("--token---:" + token);
                        console.log("--expires---:" + expires);
                        var decoded = jwt.decode(token, tokenSecret);
                        console.log("--decoded token---:" + decoded);
                        callback(null, token);
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


exports.updateByAccount = function(account, data, callback) {

    exports.findUserByAccount(account, function(err, doc)
    {
        if (err)
        {
            callback(err);
        }
        else
        {
            if(null != data) {
                console.log("updateByAccount , data=" + data);
                var text = data.text;
                console.log("updateByAccount , text=" + text);
                if(text)
                {
                    doc.text = text;
                    doc.save(function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, true);
                        }
                    });
                }
                else{
                    callback("param text is null");
                }

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

exports.findUserByAccount = function(account, callback){
    console.log("enter findUserByAccount, account=" + account);
    User.findOne({account:account},function(err, doc){
        if (err) {
            //util.log('FATAL '+ err);
            console.log("Error on findUserByAccount() Not found the account=" + account);
            callback("Error and not found the account=" + account);
        }
        else if(doc)
        {
            console.log("findUserByAccount() Got it ");
            callback(null, doc);
        }
        else
        {
            console.log("findUserByAccount() Not found the account=" + account);
            callback("Not found the account=" + account);
        }
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

exports.checkTokenValid = function(account, token, callback){

    console.log("entry checkTokenValid--:");
    var decoded = jwt.decode(token, tokenSecret);
    if(decoded)
    {
        //console.log("--entry checkTokenValid decode token--:" + decoded);
        //console.log("--decoded account---:" + decoded.account);
        //console.log("--decoded exp---:" + decoded.exp);

        var accountInToken = decoded.account;
        var expInToken = decoded.exp;
        if(accountInToken != account)
        {
            callback('Account is not match, account=' + account + ", in token account=" + accountInToken);
        }
        else{
            var bValid = moment(expInToken).isAfter(moment());
            if(bValid)
            {
                callback(null, true);
            }
            else
            {
                callback('token is expire');
            }
        }
    }
    else
    {
        console.log("--Erron on decode token--:");
        callback("token failed")
    }

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