var userCollection,
    Cookies = require( "cookies" )
    path = require("path"),
    ObjectID = require('mongodb').ObjectID;

var User = require('../modules/User.js'),
    Article = require('../modules/Article.js');

var init = function(app) {
  app.get('/article/all', function(request, response) {
    Article.getAll(function(results) {
      response.json(results);
    });
  });


  app.get('/article', function(request, response) {
      var cookies = new Cookies( request, response );
      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        User.get(usernameHash.split('|')[0], function (user) {
          if (user) {
            // response.send("successfully logged in.");
            // response.sendFile("./pages/index.html");
            response.sendFile(path.join(__dirname, '../pages', 'article.html'));
        
          } else {
            response.redirect('/signin');
          }
        });
      } else {
        response.redirect('/signin');
      }

  });

  app.post('/article/delete', function(request, response) {
      var cookies = new Cookies( request, response ),
          params = request.body;
      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        var username = usernameHash.split('|')[0];
        User.get(username, function (user) {
          if (user) {
            Article.getById(ObjectID(params.id), function(article){
              if (!article) {
                response.send({msg:"error", details: "No article found."});
              } else if (!article.user.equals(user._id)) {
                response.send({msg:"error", details: "Unauthorized."});
              } else {
                Article.collection.remove({
                  _id: ObjectID(params.id)
                }, function(err, results) {
                    if (err) {
                        response.send({msg: "error", details: "There was a problem deleting the information from the database."});
                    } else {
                        response.send({msg:"success", details: "Record deleted successfully."});
                        console.log("article deleted successfully ");
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

  app.post('/article', function(request, response) {
      var cookies = new Cookies( request, response ),
          params = request.body;


      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        var username = usernameHash.split('|')[0];
        User.get(username, function (user) {
          if (user) {


            var validated_result = Article.validateNewArticle(params);
            if (validated_result == true) {
              // check if article.id params is set or not.
              // if set, we are updating otherwise we create a new article.
              console.log(params.id);
              console.log("id>>>  ", params.id);
              if (params.id && params.id.length) {
                // try to update article.
                // var id;
                try {
                  var id = ObjectID(params.id);
                  Article.collection.update({
                    _id: id,
                    user: user._id
                  }, {
                    $set: {
                      title: params.title,
                      content: params.content,
                      ordering: params.ordering,
                      language: params.language,
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
                // new article.
                Article.collection.insert({
                  "title" : params.title,
                  "content" : params.content,
                  "ordering": params.ordering,
                  "language": params.language,
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
