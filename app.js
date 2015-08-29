
var restify = require('restify');
var ip_addr = '127.0.0.1';
var port    =  '8080';

var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//var PATH = '/jobs'
//server.get({path : PATH , version : '0.0.1'} , findAllJobs);
//server.get({path : PATH +'/:jobId' , version : '0.0.1'} , findJob);
//server.post({path : PATH , version: '0.0.1'} ,postNewJob);
//server.del({path : PATH +'/:jobId' , version: '0.0.1'} ,deleteJob);


var db = require("./models/DbUsers");
var users = require('./models/Users')
var dbUsers = require("./models/DbUsers");


var PATH_USERS = '/v100/users'
server.post({path:PATH_USERS, cmd:'/new'}, users.new);

server.get({path:PATH_USERS + '/id' + '/:id'}, users.findById);

server.get({path:PATH_USERS + '/name' + '/:id'}, users.findByName);

server.get({path:PATH_USERS}, users.all);
server.get('/jobs/:id/edit', users.edit);
server.post('/jobs/:id/edit', users.save);
server.get('/jobs/:id/delete', users.delete);
server.get('/jobs/:id/finish', users.finish);

dbUsers.connect(function(error){
    if (error) throw error;
});

server.on('close', function(errno) {
    dbUsers.disconnect(function(err) { });
});

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

