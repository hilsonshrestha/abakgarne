//mongodb configuration
// var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
// var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
// var mongoUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME; //mongodb username
// var mongoPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD; //mongodb password
// var mongoDb   = process.env.OPENSHIFT_APP_NAME; //mongodb database name
// var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDb;

var mongoString = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
// var mongoString = (process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME) || 'localhost:27017/myapp' ;


var mongo = require('mongodb'),
		monk = require('monk');

var db = monk(mongoString, {
	username: process.env.OPENSHIFT_APP_NAME,
	password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
});


var crypto = require('crypto'),
	ObjectId = mongo.ObjectID;

var validate = {
	re: {
	},
	question: function (params) {
		if (params.question.length > 500 || params.question.length < 1) {
			return "question";
		}
		return true;
	}

};


var Question = {
	collection: db.get('questionCollection'),
	validateNewQuestion: validate.question,
	
	getById: function (id, callback) {
		if (id) {
			this.collection.findOne({_id: id}, function(err, document) {
				if (err) {
					console.log("error = ",  err);
					callback(null);
				} else {
					callback(document);
				}
			});
			return;
		}
		callback(null);
	},
	getAll: function (callback) {
		this.collection.find({}, function(err, documents) {
			callback(documents);
		});
	},
	getLatest: function (callback) {
		this.collection.findOne({}, {sort: {created: -1}}, function (err, document) {
			callback(document);
		});
	}
};

module.exports = Question;
