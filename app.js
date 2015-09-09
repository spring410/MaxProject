var express = require('express');
var bodyParser = require('body-parser');
var URL = require('url');

var restify = require('restify');
var ip_addr = '127.0.0.1';
var port    =  '8080';

var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.use(bodyParser.json({limit: '1mb'}));
server.use(bodyParser.urlencoded({
    extended: true
}));

var db = require("./models/usersdb");
var users = require('./models/userinfo')
var dbUsers = require("./models/usersdb");

var PATH_USERS = '/v100/users'

server.get({path:PATH_USERS + '/accounts' + '/:id'}, users.findByAccount);
server.get({path:PATH_USERS + '/displaynames' + '/:id'}, users.findByName);

server.post({path:PATH_USERS + '/signup'}, users.signup);
server.post({path:PATH_USERS + '/signin'}, users.signin);
server.post({path:PATH_USERS + '/setpassword'}, users.setpassword);
server.post({path:PATH_USERS + '/accounts' + '/:id'}, users.updateByAccount);

//server.get({path:PATH_USERS}, users.findAll);
//server.get({path:PATH_USERS + '/_id' + '/:id'}, users.findById);
//server.post({path:PATH_USERS + '/id' + '/:id'}, users.updateById);
//server.post({path:PATH_USERS + '/del' + '/:id'}, users.deleteById);


dbUsers.connect(function(error){
    if (error) throw error;
});

server.on('close', function(errno) {
    dbUsers.disconnect(function(err) { });
});

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});
