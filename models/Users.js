/**
 * Created by Administrator on 2015/8/27.
 */


var db = require('./DbUsers');

exports.new = function (req, res, next) {
    console.log("enter to add new user..." + req);
    var title = req.body.title || '';
    title = title.trim();

    db.add(title, function (err, success) {
        if(success){
            res.send(200 , success);
            return next();
        }else {
            console.log('Response error '+err);
            return next(err);
        }
    });
};

exports.findById = function (req, res, next) {
    console.log("enter query findById..." + req);
    var id = req.params.id;
    db.findUserById(id, function(err, success){
        if(success){
            res.send(200 , success);
            return next();
        }else {
            console.log('Response error '+err);
            return next(err);
        }
    });
}

exports.findByName = function (req, res, next) {
    console.log("enter query findByName..." + req);
    var name = req.params.id;
    db.findUserByName(name, function(err, success){
        if(success){
            res.send(200 , success);
            return next();
        }else {
            console.log('Response error '+err);
            return next(err);
        }
    });
}

exports.all = function (req, res, next) {
    console.log("enter query all..." + req);
    //res.setHeader('Access-Control-Allow-Origin','*');
    db.find(function(err , success){
        if(success){
            console.log('Response success '+success);
            res.send(200 , success);
            return next();
        }else{
            console.log('Response error '+err);
            return next(err);
        }
    });
}


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

exports.save = function (req, res, next) {
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

exports.delete = function (req, res, next) {
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