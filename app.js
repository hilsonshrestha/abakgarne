// //mongodb configuration
// var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
// var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
// var mongoUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME; //mongodb username
// var mongoPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD; //mongodb password
// var mongoDb   = process.env.OPENSHIFT_APP_NAME; //mongodb database name
// var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDb;

var mongoString = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
// var mongoString = 'localhost:27017/myapp' ;

var express = require('express');
var app = express();
var fs = require("fs");
// var swig = require("swig");
var bodyParser = require("body-parser");
//Tells server to support JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var http = require('http').Server(app);


var mongo = require('mongodb');
var monk = require('monk');
var db = monk(mongoString, {
	username: process.env.OPENSHIFT_APP_NAME,
	password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
});




app.use(function(req,res,next){
    // Make our db accessible to our router
    req.db = db;
    next();
});




// This is where all the magic happens!
// app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/pages');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
// app.set('view cache', false);
// To disable Swig's cache, do the following:
// swig.setDefaults({ cache: false });

app.use('/static', express.static(__dirname + '/static', {maxAge: 10101010}));




var controller = {
	home: require('./controllers/home.js'),
    article: require('./controllers/article.js'),
    question: require('./controllers/question.js'),
    answer: require('./controllers/answer.js'),
};


controller.home(app); // initializes main landing page.
controller.article(app);
controller.question(app);
controller.answer(app);


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
http.listen(port, ipaddress, function() {
	// console.log(process.env.OPENSHIFT_NODEJS_IP);
  console.log('listening on *:3000');
});