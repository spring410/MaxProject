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
server.get({path:PATH_USERS}, users.findAll);
server.get({path:PATH_USERS + '/id' + '/:id'}, users.findById);
server.get({path:PATH_USERS + '/name' + '/:id'}, users.findByName);

server.post({path:PATH_USERS + '/add'}, users.add);
server.post({path:PATH_USERS + '/del' + '/:id'}, users.deleteById);

server.post({path:PATH_USERS + '/id' + '/:id'}, users.updateById);
server.post({path:PATH_USERS + '/name' + '/:id'}, users.updateByName);

dbUsers.connect(function(error){
    if (error) throw error;
});

server.on('close', function(errno) {
    dbUsers.disconnect(function(err) { });
});

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});
