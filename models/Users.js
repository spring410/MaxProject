/**
 * Created by Administrator on 2015/8/27.
 */


var db = require('./DbUsers');


exports.new = function (req, res, next) {
    var title = req.body.title || '';
    title = title.trim();
    if (!title) {
        return res.render('error.html', {message: '标题是必须的'});
    }
    db.add(title, function (err, row) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

exports.view = function (req, res, next) {
    res.redirect('/');
};

//exports.all = function (req, res, next) {
//    console.log("enter query all for jobs");
//    db.allUsers(function (err, row) {
//        if (err) {
//            return next(err);
//        }
//        if (!row) {
//            return next();
//        }
//    });
//};


exports.find = function (req, res, next) {
    console.log("enter query all for jobs");
    res.setHeader('Access-Control-Allow-Origin','*');
    db.find(function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            console.log("error on query all for jobs");
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