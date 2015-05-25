var userCollection,
    Cookies = require( "cookies" )
    path = require("path");


var User = require('../modules/User.js');

var init = function(app) {


  app.get('/', function(request, response) {

      var cookies = new Cookies( request, response );
      var usernameHash = cookies.get('user');
      if (User.isValidUsernameHash(usernameHash)) {
        User.get(usernameHash.split('|')[0], function (user) {
          if (user) {
            // response.send("successfully logged in.");
            // response.sendFile("./pages/index.html");
            response.sendFile(path.join(__dirname, '../pages', 'index.html'))

          } else {
            response.redirect('/signin');
          }
        });
      } else {
        response.redirect('/signin');
      }
  });

  app.get('/signin', function(request, response) {
    console.log("Signin GET");
    User.getTotal(function (total) {
     response.sendFile(path.join(__dirname, '../pages', total == 0 ? "signup.html" : "signin.html"));
    });
  });

  app.post('/signin', function(request, response) {
    console.log("Signin POST");
    setTimeout(function ( ) {
      var cookies = new Cookies( request, response ),
          params = request.body;
      var validated_result = User.validateSignIn(params);
      if (validated_result == true) {
        User.get(params.username, function (user) {
          if (user) {
            // check for correct password
            if (user.password == User.createPassword(params.username, params.password)) {
              // valid user
              cookies.set("user", User.createUsernameHash(user.username), {
                maxAge: 432000000 // 5 days
              });
              
              response.send({msg:"redirect", url: "/"});


              // // set the header so the address bar doesn't still say /login
              // response.location("/");
              // // And forward to success page
              // response.redirect("/");
            } else {
              response.send({msg:"invalid_username_password"});
              // response.send("incorrect username or password");
            }
          } else {
            response.send({msg:"invalid_username_password"});
            // response.send("incorrect username or password");
          }
        });
      } else {
        response.send({msg:"invalid_username_password"});
        // response.send("incorrect username or password");
      }
    }, 2000);

  });



  app.get('/signout', function(request, response) {
      var cookies = new Cookies( request, response );
      cookies.set("user", "", {
        maxAge: 0 // 0 days
      });
      // set the header so the address bar doesn't still say /login
      response.location("/");
      // And forward to success page
      response.redirect("/");
  });


  app.get('/signup', function(request, response) {
    // response.send("ok");
    response.sendFile(path.join(__dirname, '../pages',"signup.html"));
  });

  app.post('/signup', function(request, response) {

    User.getTotal(function (total) {
      console.log("TOTAL  =  " + total);
      if (total == 0) {
        // response.sendFile(path.join(__dirname, '../pages',"signup.html"));

        console.log("new user trying to signup...");
        setTimeout(function () {
          var cookies = new Cookies( request, response ),
              params = request.body;
          // var validated_result = validate.signup(params);
          var validated_result = User.validateSignUp(params);
          if (validated_result == true) {
            User.get(params.username, function (user) {
              if (user) {
                response.send({msg: "user_exists"});
                return;
              } else {
                // response.send("done");
                // awesome, unique username selected... go on. create new user
                console.log('Unique username selected... creating new user');
                User.collection.insert({
                    "username" : params.username,
                    "firstname" : params.firstname,
                    "lastname": params.lastname,
                    "password": User.createPassword(params.username, params.password),
            //         "usertype": params.usertype,
            //         "courses": []
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        // response.send("There was a problem adding the information to the database.");
                        response.send({msg: "error", details: "There was a problem adding the information to the database."});
                    } else {
                        // Signup success.
                        cookies.set("user", User.createUsernameHash(params.username), {
                          maxAge: 432000000 // 5 days
                        });
                        
                        // set the header so the address bar doesn't still say /login
                        // response.location("/");
                        // And forward to success page
                        // response.redirect("/");
                        response.send({msg:"redirect", url: "/"});
                        console.log("sign in sucessfull");
                    }
                });
              }
            });
          } else {
            // response.send(validated_result);
            response.send({msg: "field_error", field: validated_result});
          }
          
        }, 1000);



      } else {
        response.send("Unauthorized. Please contact your admin.");
        // response.sendFile(path.join(__dirname, '../pages',"signin.html"));
      }
    });

  });
};

// var crypto = require('crypto'),
//     userCollection,
//     Cookies = require( "cookies" );

// var User = require('../modules/User.js');

// var init = function(app) {
//   app.get('/logout', function(request, response) {
//       var cookies = new Cookies( request, response );
//       cookies.set("user", "", {
//         maxAge: 0 // 0 days
//       });
//       response.location('/');
//       response.redirect('/');
//   });

//   app.get('/login', function(request, response) {
//     response.sendfile('pages/home.html');
//     console.log("login page request");
//   });

//   app.post('/signup', function(request, response) {
//     console.log("new user trying to signup...");
//     // userCollection = request.db.get('usercollection');
//     setTimeout(function () {
//       var cookies = new Cookies( request, response ),
//           params = request.body;
//       // var validated_result = validate.signup(params);
//       var validated_result = User.validateSignUp(params);
//       if (validated_result == true) {
//         User.getUser(params.username, function (user) {
//           if (user) {
//             response.send({msg: "user_exists"});
//             return;
//           } else {
//             // awesome, unique username selected... go on. create new user
//             console.log('Unique username selected... creating new user');
//             User.collection.insert({
//                 "username" : params.username,
//                 "firstname" : params.firstname,
//                 "lastname": params.lastname,
//                 "password": User.createPassword(params.username, params.password),
//                 "usertype": params.usertype,
//                 "courses": []
//             }, function (err, doc) {
//                 if (err) {
//                     // If it failed, return error
//                     // response.send("There was a problem adding the information to the database.");
//                     response.send({msg: "error", details: "There was a problem adding the information to the database."});
//                 } else {
//                     // Signup success.
//                     cookies.set("user", User.createUsernameHash(params.username), {
//                       maxAge: 432000000 // 5 days
//                     });
                    
//                     // set the header so the address bar doesn't still say /login
//                     // response.location("/");
//                     // And forward to success page
//                     // response.redirect("/");
//                     response.send({msg:"redirect", url: "/"});
//                 }
//             });
//           }
//         });
//       } else {
//         // response.send(validated_result);
//         response.send({msg: "field_error", field: validated_result});
//       }
      
//     }, 4000);
//   });

//   app.post('/signin', function (request, response) {
//     console.log("user trying to signin...");
//     setTimeout(function ( ) {
//       var cookies = new Cookies( request, response ),
//           params = request.body;
//       var validated_result = User.validateSignIn(params);
//       if (validated_result == true) {
//         User.getUser(params.username, function (user) {
//           if (user) {
//             // check for correct password
//             if (user.password == User.createPassword(params.username, params.password)) {
//               // valid user
//               cookies.set("user", User.createUsernameHash(user.username), {
//                 maxAge: 432000000 // 5 days
//               });
              
//               response.send({msg:"redirect", url: "/"});


//               // // set the header so the address bar doesn't still say /login
//               // response.location("/");
//               // // And forward to success page
//               // response.redirect("/");
//             } else {
//               response.send({msg:"invalid_username_password"});
//               // response.send("incorrect username or password");
//             }
//           } else {
//             response.send({msg:"invalid_username_password"});
//             // response.send("incorrect username or password");
//           }
//         });
//       } else {
//         response.send({msg:"invalid_username_password"});
//         // response.send("incorrect username or password");
//       }
//     }, 2000);
//   });

//   app.get('/broadcast', function(request, response) {
//     response.sendfile('pages/broadcast.html');
//     console.log("broadcast page request");
//   });

//   app.get('/broadcast_receiver', function(request, response) {
//   	response.sendfile('pages/broadcast_receiver.html');
//   	console.log("broadcast_receiver");
//   });
//   app.get('/test', function(request, response) {
//   	response.sendfile('pages/testindex.html');
//   	console.log("test");
//   });
// }
module.exports = init;
