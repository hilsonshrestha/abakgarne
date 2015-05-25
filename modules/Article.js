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
		// username: /^([a-zA-Z0-9_]{6,20})$/,
		// password: /^(.{6,100})$/,
		// name: /^([a-zA-Z]{1,20})$/
		// title: /^{1, 256}$/,
		// content: /^{20, 1024}$/,
	},
	article: function (params) {
		// console.log(params);
		// return true;
		var self = validate;
		// if (!self.re.title.test(params.title)) {
			// return "title"
		// } else if (!self.re.content.test(params.content)) {
			// return "content"
		// }

		if (params.title.length > 200 || params.title.length < 1) {
			return "title";
		} else if (params.content.length < 10) {
			return "content";
		} else if (parseInt(params.ordering) == NaN) {
			return "ordering";
		}
		return true;
	}

};


var Article = {
	collection: db.get('articleCollection'),
	validateNewArticle: validate.article,
	

	/*
	 * Takes in a article.
	 * Callback is called with the available data from database.
	 */
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
	// getCoursesFromTeacher: function (userid, callback) {
	// 	if (userid && userid.length == 24) {
	// 		this.collection.find({creator: ObjectId(userid)}, function( err, document ) {
	// 			if (err) {
	// 				console.log("error = ",  err);
	// 				callback([]);
	// 			} else {
	// 				callback(document);
	// 			}
	// 		});
	// 	} else {
	// 		callback([]);
	// 	}
	// },
	getAll: function (callback) {
		this.collection.find({}, {sort: {created: -1}}, function(err, documents) {
			// var results = [];
			// for (var i = 0; i < documents.length; i++) {
			// 	results.push(documents[i]);
			// 	// results[i]._id = documents[i]._id.str.toString();
			// 	// results[i]._id = "";
			// }
			// console.log(results);
			// callback(results);
			callback(documents);
		});
		
	}
	// search: function (query, callback) {
	// 	if (!query) {
	// 		callback([]);
	// 		return;
	// 	}

	// 	query = query.toUpperCase();
	// 	this.collection.find({

	// 	}, function (err, documents) {
	// 		var results = [];
			
	// 		for (var i = 0; i < documents.length; i++) {
	// 			var course = documents[i];
	// 			if (course.courseTitle.toUpperCase().search(query) != -1 || 
	// 				query.search(course.courseTitle.toUpperCase()) != -1 ||
	// 				course.courseCode.toUpperCase().search(query) != -1 ||
	// 				query.search(course.courseCode.toUpperCase()) != -1) {
	// 				results.push(course);
	// 			} 
	// 		}
	// 		callback(results);
	// 	});
	// }
};

module.exports = Article;
