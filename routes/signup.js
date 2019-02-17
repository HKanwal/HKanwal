var express = require("express");
var router = express.Router();
var UserModel = require("../models/User");
var bcrypt = require("bcrypt");

/* POST sign up info. */
router.post("/", function(req, res, next) {
	var username = req.body.signup_username;
	var password = req.body.signup_password;
	var email = req.body.email;
	var session = req.session;

	/*
		Sends response according to what is in DB:
		"Name already in use"
		"Email already in use"
		"Name and email already in use"
		"DB search error"
		"DB save error"
		"Hashing error"
		"Success"
	*/
	UserModel.find({"$or": [{"username": username}, {"email": email}]}, function(err, users) {
		if(users.length > 0) {
			if(users[0].username === username && users[0].email === email) {
				res.send("Name and email already in use");
			} else if(users[0].username === username) {
				res.send("Name already in use");
			} else if(users[0].email === email) {
				res.send("Email already in use");
			}
		} else if(err) {
			res.send("DB search error");
		} else {
			bcrypt.hash(password, 10, function(err, hash) {
				if(err) {
					res.send("Hashing error");
				} else {
					var user = new UserModel({
						username: username,
						password: hash,
						email: email
					});

					user.save(function(err) {
						if(err) {
							res.send("DB save error");
						} else {
							session.username = username;
							session.email = email;
							res.send("Success");
						}
					});
				}
			});
		}
	});
});

module.exports = router;
