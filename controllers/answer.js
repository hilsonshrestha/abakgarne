var userCollection,
    Cookies = require( "cookies" )
    path = require("path"),
    ObjectID = require('mongodb').ObjectID;

var User = require('../modules/User.js'),
    Question = require('../modules/Question.js');
    Answer = require('../modules/Answer.js');

var init = function(app) {
  app.get('/answer/all', function(request, response) {
    Answer.getAll(function(results) {
      response.json(results);
    });
  });

  app.get('/answer', function(request, response) {
    response.sendFile(path.join(__dirname, '../pages', 'answer.html'));
  });

  app.post('/answer', function(request, response) {
      var cookies = new Cookies( request, response ),
          params = request.body;

            var validated_result = Answer.validateNewAnswer(params);
            if (validated_result == true) {
                // new answer.
                Answer.collection.insert({
                  "answer" : params.answer,
                  "questionID" : params.questionID,
                  "responderID": params.responderID,
                  "created": Date.now(),
                  // "user": user._id
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        response.send({msg: "error", details: "There was a problem adding the information to the database."});
                    } else {
                        // Answer success
                        response.send({msg:"success", details: "Response added to Database"});
                        // response.send({msg:"redirect", url: "/"});
                        console.log("added successfully");
                    }
                });
            } else {
              response.send({msg: "field_error", field: validated_result})
            }
  });
};

module.exports = init;
