var express = require("express");
var router = express.Router();
var UserModel = require("../models/User");

router.get("/", function(req, res, next) {
	var username = req.query.login_username;
	var password = req.query.login_password;
	console.log(req.query);
	/*
		Sends response according to DB search:
		"Incorrect password"
		"User not found"
		"DB search error"
		"Success"
	*/
	UserModel.find({"username": username}, function(err, users) {
		if(err) {
			res.send("DB search error");
		} else {
			if(users.length > 0) {
				if(users[0].password === password) {
					res.cookie("user", username);
					res.send("Success");
				} else {
					res.send("Incorrect password");
				}
			} else {
				res.send("User not found");
			}
		}
	});
});

module.exports = router;