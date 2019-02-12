var express = require('express');
var router = express.Router();
var UserModel = require('../models/User');

router.get('/', function(req, res, next) {
	var username = req.query.username;
	var password = req.query.password;
	
	UserModel.find({"username": username}, function(err, users) {
		if(err) {
			res.render('error', {message: "db search error", error: err});
		} else {
			if(users.length > 0) {
				if(users[0].password === password) {
					res.redirect("/");
				} else {
					// TODO: handle this better
					res.send("Incorrect password");
				}
			} else {
				// TODO: handle this better
				res.send("User not found");
			}
		}
	});
});

module.exports = router;