var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// TODO: Add restrictions to username and pwd
var userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/, required: true}
});

module.exports = mongoose.model("User", userSchema);