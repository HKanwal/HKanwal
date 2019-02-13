var express = require("express");
var router = express.Router();
var UserModel = require("../models/User");

/* POST sign up info. */
router.post("/", function(req, res, next) {
	var username = req.body.signup_username;
	// TODO: hash pwd
	var password = req.body.signup_password;
	var email = req.body.email;
	
	/*
		Sends response according to what is in DB:
		"Name already in use"
		"Email already in use"
		"DB search error"
		"DB save error"
		"Success"
	*/
	UserModel.find({"$or": [{"username": username}, {"email": email}]}, function(err, users) {
		if(users.length > 0) {
			if(users[0].username === username) {
				res.send("Name already in use");
			} else if(users[0].email === email) {
				res.send("Email already in use");
			}
		} else if(err) {
			res.send("DB search error");
		} else {
			var user = new UserModel({
				username: username,
				password: password,
				email: email
			});

			user.save(function(err) {
				if(err) {
					res.send("DB save error");
				} else {
					res.cookie("user", username);
					res.send("Success");
				}
			});
		}
	});
});

module.exports = router;
