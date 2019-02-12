var express = require('express');
var router = express.Router();
var UserModel = require('../models/User');

/* POST sign up info. */
router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	// TODO: Do somthing when username or email alrdy in db
	UserModel.find({"$or": [{"username": username}, {"email": email}]}, function(err, users) {
		if(users.length > 0) {
			res.send("Name or email already in use");
		} else if(err) {
			res.render('error', {message: "db search error", error: err});
		} else {
			var user = new UserModel({
				username: username,
				password: password,
				email: email
			});

			user.save(function(err) {
				if(err) {
					// TODO: create and redirect to error page
					console.log(err);
					res.render('error', {message: "Error with form or unable to connect to db", error: err});
				} else {
					// redirect to success page
					res.redirect('/');
				}
			});
		}
	});
});

module.exports = router;
