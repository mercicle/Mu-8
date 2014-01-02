
/* */
var crypto = require('crypto');
var url = require('url');
 
var mongo = require('../config/mongo');
var db = mongo.db;
var BSON = mongo.BSON;


exports.checkUsername = function(req, res) {
    var username = req.params.username;
    
    console.log('Retrieving user by username:' + username);
    db.collection('users', function(err, collection) {
        collection.findOne({'username': username}, function(err, item) {
            if (err) {
                console.log("An error in finding user by username");
            }
            
            if (item) {
                res.end("unavailable");
            }
            else {
                res.end("ok");
            }
        })
    });
}

exports.checkUsernameAtLogin = function(req, res) {
    var username = req.params.username;
    
    console.log('Retrieving user by username:' + username);
    db.collection('users', function(err, collection) {
        collection.findOne({'username': username}, function(err, item) {
            if (err) {
                console.log("An error in finding user by username");
            }
            
            if (item) {
                res.end("ok");
            }else{
                res.end("notok");
            }
        })
    });
}

exports.checkEmail = function(req, res) {
    var email = req.params.email;
    
    console.log('Retrieving user by email:' + email);
    db.collection('users', function(err, collection) {
        collection.findOne({'email': email}, function(err, item) {
            if (err) {
                console.log("An error in finding user by email");
            }
            
            if (item) {
                res.end("unavailable");
            }
            else {
                res.end("ok");
            }
        })
    });
}

exports.signup = function(req, res) {
    var user = req.body;
    
    console.log('Creating user: ' + JSON.stringify(user));
    
    user.salt = makeSalt();
    user.hashed_password = encryptPassword(user.salt, user.password);

    //don't want to save the actual password
    delete user.password2;
    delete user.password;

    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'This is embarrassing... something went terribly wrong!'});
            } else {
                console.log('Successfully created user and here is result: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

/*
 * Description: check the username and password
 *               if successful, write to a session
 */
exports.login = function(req, res) {
    var params = req.body;   

    //console.log('Logging in ' + params.username);

    db.collection('users', function(err, collection) {
        collection.findOne({'username': params.username}, function(err, item) {            
            if (err) {
                //console.log("Error in getting username");
                res.send(404, 'This is embarrassing... something went terribly wrong!');
            }
            
            //if i found the user
            if (item) {

                //get the hashed password using the saved salt and the password provided
                var hashed_password = encryptPassword(item.salt, params.password);
                
                if (hashed_password === item.hashed_password) {
                    //console.log('Login Success: ' + params.username);                                        
 
                    // make cookie
                    var oneYearInMilliseconds = 86400000 * 365;
                    req.session.cookie.expires = new Date(Date.now() + oneYearInMilliseconds);

                    //http://expressjs.com/api.html
                    //The maxAge option is a convenience option for setting "expires" relative to the current time in milliseconds. 
                    req.session.cookie.maxAge = oneYearInMilliseconds;

                    req.session.user_id = item._id;
                    
                    console.log('req.session' + req.session); 

                    //for (i in req.session){
                    //    console.log('req.session' + i); 
                    //}

                    res.send(200, req.session.user_id);
                }
                else {
                    //console.log('Invalid password');
                    res.send(404, "I think you forgot your password ;)");
                }
            }
            else {
                //console.log("No user by that username");
                res.send(404, "I think you forgot your username ;)");
            }
        })
    });
}

/*
 * Description: Find a user by username
 */
exports.findById = function(req, res) {
    var id = req.params.id;
    
    //console.log('Getting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

/*
 * Description: returns a user stored in session
 * 
 */
exports.session = function(req, res) {    
    if (req.session.user_id) {
        res.send(req.session.user_id);
    }
    else {
        res.send("none");
    }
}

/*
 * Description: Changes the user password
 * 
 */
exports.changePassword = function(req, res) {

    var id = req.params.id;
    var oldpass = req.body.oldpass;
    var newpass = req.body.newpass;
    
    //console.log("Changing password of id: " + id)
    //console.log(newpass);
    
    db.collection('users', function(err, collection) {
        collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, user) {
            if (err) {
                console.log("Error in retrieving a user by id");
                res.send(404, "This is embarrassing... something went terribly wrong!");
            }
            
            if (user) {
                console.log(user.password);
                if (user.password !== oldpass) {
                    //console.log("Invalid password");
                    res.send(404, "Oh, sorry, that's an invalid password!");
                }
                else {
                    user.password = newpass;
                    user.salt = makeSalt();
                    user.hashed_password = encryptPassword(user.salt, user.password);

                    collection.update({_id:new BSON.ObjectID(id)}, user, {safe: true}, function(err, result) {
                        if (err) {
                            //console.log('Error changing password: ' + err);
                            res.send(404, 'This is embarrassing... something went terribly wrong while changing your password!');
                        } else {
                            //console.log('' + result + ' password changed');                            
                            res.send(user.password);
                        }
                    });
                }
            }
            else {
                res.send(404, "I think you forgot your username ;)");
            }
        })
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    
    delete user._id;
    
    //console.log('Updating user: ' + id);
    //console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                //console.log('Error updating user: ' + err);
                res.send({'error':'This is embarrassing... something went terribly wrong while updating!'});
            } else {
                //console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

/*
 * Description: logs out user and destroys session
 */
exports.logout = function(req, res) {
    console.log('Logging out user');
      
    if (req.session.user_id) {
        req.session.destroy();        
        res.send(200, "success");
    }
    else {
        res.send("not logged in");
    }
}

/*
 * Description: makes a salt for encrypting the password
 */
function makeSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
}

/*
 * Description: returns a encrypted password built by using salt/password
 */
function encryptPassword(salt, password) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
}