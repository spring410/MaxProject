/**
 * Created by Administrator on 2015/8/27.
 */

var constant = require('./constant');
var db = require('./usersdb');
var URL = require('url');
var Querystring = require('querystring');

exports.signup = function (req, res, next) {
    console.log("enter to add new user, req=" + req);
    var data = URL.parse(req.url).query;
    db.add(data, function (err, success) {
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Error= '+err);
            res.send(constant.failed , success);
            return next(err);
        }
    });
};

exports.signin = function (req, res, next) {
    console.log("enter to add new user, req=" + req);
    var data = URL.parse(req.url).query;
    db.signin(data, function (err, success) {
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Error= '+err);
            res.send(constant.failed);
            return next(err);
        }
    });
};

exports.setpassword = function (req, res, next) {
    console.log("enter to add new user, req=" + req);
    var data = URL.parse(req.url).query;
    db.setpassword(data, function (err, success) {
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Error= '+err);
            res.send(constant.failed);
            return next(err);
        }
    });
};


exports.findById = function (req, res, next) {
    console.log("enter query findById..." + req);
    var id = req.params.id;
    db.findUserById(id, function(err, success){
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Response error '+err);
            res.send(constant.failed , success);
            return next(err);
        }
    });
}
exports.findByAccount = function (req, res, next) {
    console.log("enter query findByAccount..." + req);
    var name = req.params.id;
    console.log("enter query findByAccount name=" + name);
    db.findUserByAccount(name, function(err, success){
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Response error '+err);
            res.send(constant.failed , success);
            return next(err);
        }
    });
}

exports.findByName = function (req, res, next) {
    console.log("enter query findByName..." + req);
    var name = req.params.id;
    db.findUserByDisplayName(name, function(err, success){
        if(success){
            res.send(constant.ok , success);
            return next();
        }else {
            console.log('Response error '+err);
            res.send(constant.failed , success);
            return next(err);
        }
    });
}

exports.findAll = function (req, res, next) {
    console.log("enter query all..." + req);
    //res.setHeader('Access-Control-Allow-Origin','*');
    db.find(function(err , success){
        if(success){
            console.log('Response success '+success);
            res.send(200 , success);
            return next();
        }else{
            console.log('Response error '+err);
            res.send(404 , success);
            return next(err);
        }
    });
}


exports.updateById = function (req, res, next) {
    var id = req.params.id;
    var title = req.body.title || '';
    title = title.trim();
    if (!title) {
        return res.render('error.html', {message: '标题是必须的'});
    }
    db.editTitle(id,title,function (err, result) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.updateByAccount = function (req, res, next) {

    var account = req.params.id;
    var data = URL.parse(req.url).query;
    if (!data || !account) {
        res.send(constant.failed, constant.null_params_str);
    }
    db.updateByAccount(account, data, function (err, success)
    {
        if (err)
        {
            res.send(constant.failed , success);
            return next(err);
        }
        else
        {
            res.send(200 , success);
        }
    });
};

exports.deleteById = function (req, res, next) {
    var id = req.params.id;
    db.delete(id, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.finish = function (req, res, next) {
    var finished = req.query.status === 'yes' ? true : false;
    var id = req.params.id;
    db.editFinished(id,finished, function (err, result) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};


exports.edit = function (req, res, next) {
    var id = req.params.id;
    db.findTodoById(id, function (err, row) {
        if (err) {
            return next(err);
        }
        if (!row) {
            return next();
        }
        res.render('todo/edit.html', {todo: row});
    });
};
