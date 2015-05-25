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
    Cookies = require('cookies');


var validate = {
	re: {
		username: /^([a-zA-Z0-9_]{5,20})$/,
		password: /^(.{6,100})$/,
		name: /^([a-zA-Z]{1,20})$/
	},
	signUp: function (params) {
		var self = validate;
		// if (params.usertype != "student" && params.usertype != "teacher") {
			// return "usertype";
		if (!self.re.name.test(params.firstname)) {
			return "firstname";
		} else if (!self.re.name.test(params.lastname)) {
			return "lastname";
		} else if (!self.re.username.test(params.username)) {
			return "username";
		} else if (!self.re.password.test(params.password)) {
			return "password";
		} else if (params.password != params.repassword) {
			return "repassword";
		}
		return true;
	},
	signIn: function (params) {
		var self = validate;
		if (!self.re.username.test(params.username)) {
			return "username";
		} else if (!self.re.password.test(params.password)) {
			return "password";
		}
		return true;
	}
};


var User = {
	collection: db.get('userCollection'),
	validateSignUp: validate.signUp,
	validateSignIn: validate.signIn,

	/*
	 * Creates password for saving in the database.
	 * Takes username and password as parameters.
	 */
	createPassword: function (username, password) {
		return crypto.createHash('sha512').update(username + password + username).digest('hex');
	},

	/*
	 * Creates username hash for cookie generation.
	 */
	createUsernameHash: function (username) {
		return username + "|" + crypto.createHash('sha256').update("DhXQp[]$" + username).digest("hex");
	},

	/*
	 * Checks if the username hash is a valid one.
	 * Returns true if valid.
	 */
	isValidUsernameHash: function (userHash) {
		if (!userHash) return false;
		var s = userHash.split('|');
		return  User.createUsernameHash(s[0]) === userHash;
	},

	/*
	 * Takes in a username and checks if user is in databse.
	 * Callback is called with the available data from database.
	 */
	get: function (username, callback) {
		if (username) {
			this.collection.findOne({username: username}, function(err, document) {
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
	getTotal: function (callback) {
		this.collection.count({}, function(err, count) {
			callback(count);
		});
	},

	getById: function (userId, callback) {
		if (userId) {
			this.collection.findOne({_id: userId}, function(err, document) {
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


	isValidUser: function (request, response, callback) {
		var cookies = new Cookies( request, response );
		var usernameHash = cookies.get('user');
		if (User.isValidUsernameHash(usernameHash)) {
			User.get(usernameHash.split('|')[0], function (user) {
				if (user) {
					callback(user)
				} else {
					callback(null);
				}
			});
		} else {
			callback(null);
		}
	},

	search: function (query, callback) {
		if (!query) {
			callback([]);
			return;
		}
		query = query.toUpperCase();
		this.collection.find({

		}, function (err, documents) {
			var results = [];
			
			for (var i = 0; i < documents.length; i++) {
				var user = documents[i];
				if (user.firstname.toUpperCase().search(query) != -1 || 
					query.search(user.firstname.toUpperCase()) != -1 ||
					user.lastname.toUpperCase().search(query) != -1 ||
					query.search(user.lastname.toUpperCase()) != -1) {
					results.push(user);
				} 
			}
			callback(results);
		});
	}

};

module.exports = User;
