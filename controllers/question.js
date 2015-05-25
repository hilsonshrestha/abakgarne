var userCollection,
    Cookies = require( "cookies" )
    path = require("path"),
    ObjectID = require('mongodb').ObjectID;

var User = require('../modules/User.js'),
    Question = require('../modules/Question.js');

var init = function(app) {
  app.get('/question/all', function(request, response) {
    Question.getAll(function(results) {
      response.json(results);
    });
  });

  app.get('/question/latest', function(request, response) {
    Question.getLatest(function(results) {
      response.json(results);
    });
  });


  app.get('/question', function(request, response) {
      var cookies = new Cookies( request, response );
      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        User.get(usernameHash.split('|')[0], function (user) {
          if (user) {
            response.sendFile(path.join(__dirname, '../pages', 'question.html'));
          } else {
            response.redirect('/signin');
          }
        });
      } else {
        response.redirect('/signin');
      }
  });

  app.post('/question/delete', function(request, response) {
      var cookies = new Cookies( request, response ),
          params = request.body;
      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        var username = usernameHash.split('|')[0];
        User.get(username, function (user) {
          if (user) {
            Question.getById(ObjectID(params.id), function(question){
              if (!question) {
                response.send({msg:"error", details: "No question found."});
              } else if (!question.user.equals(user._id)) {
                response.send({msg:"error", details: "Unauthorized."});
              } else {
                Question.collection.remove({
                  _id: ObjectID(params.id)
                }, function(err, results) {
                    if (err) {
                        response.send({msg: "error", details: "There was a problem deleting the information from the database."});
                    } else {
                        response.send({msg:"success", details: "Record deleted successfully."});
                        console.log("question deleted successfully ");
                    }
                });
              }
            });
          } else {
            response.redirect('/signin');
          }
        });
      } else {
        response.redirect('/signin');
      }
  });

  app.post('/question', function(request, response) {
      var cookies = new Cookies( request, response ),
          params = request.body;

      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        var username = usernameHash.split('|')[0];
        User.get(username, function (user) {
          if (user) {
            var validated_result = Question.validateNewQuestion(params);
            if (validated_result == true) {
              // check if article.id params is set or not.
              // if set, we are updating otherwise we create a new article.
              console.log(params.id);
              console.log("id>>>  ", params.id);
              if (params.id && params.id.length) {
                // try to update question.
                // var id;
                try {
                  var id = ObjectID(params.id);
                  Question.collection.update({
                    _id: id,
                    user: user._id
                  }, {
                    $set: {
                      question: params.question,
                      // content: params.content,
                      // ordering: params.ordering,
                      updated: Date.now()
                    }
                  }, function (err, doc) {
                      if (err) {
                          // If it failed, return error
                          // response.send("There was a problem adding the information to the database.");
                          response.send({msg: "error", details: "There was a problem while updating the record."});
                      } else {
                        if (doc == 1) {
                          response.send({msg:"success", details: "Update successful"});
                          console.log("update successful.");
                        } else {
                          response.send({msg: "error", details: "No record to update."});
                          console.log("nothing to update.");
                        }
                      }
                  });
                } catch (e) {
                  console.log(e);
                  response.send({msg: "error", details: "There was a problem while updating the record."});
                }
              } else {
                // new question.
                Question.collection.insert({
                  "question" : params.question,
                  // "content" : params.content,
                  // "ordering": params.ordering,
                  "created": Date.now(),
                  "user": user._id
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        // response.send("There was a problem adding the information to the database.");
                        response.send({msg: "error", details: "There was a problem adding the information to the database."});
                    } else {
                        // Signup success.
                        response.send({msg:"success", url: "Article added successfully"});
                        // response.send({msg:"redirect", url: "/"});
                        console.log("added successfully sucessfull");
                    }
                });
              }

              

            } else {
              response.send({msg: "field_error", field: validated_result})
            }


            // response.send("successfully logged in.");
            // response.sendFile("./pages/index.html");
            // response.sendFile(path.join(__dirname, '../pages', 'article.html'));
        
          } else {
            response.redirect('/signin');
          }
        });
      } else {
        response.redirect('/signin');
      }
  });
};

module.exports = init;
