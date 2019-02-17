var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var fs = require("fs");
var session = require("express-session");

var indexRouter = require("./routes/index");
var toolsRouter = require("./routes/tools");
var gamesRouter = require("./routes/games");
var signUpRouter = require("./routes/signup");
var logInRouter = require("./routes/login");
var logOutRouter = require("./routes/logout");
var mongoDB = "mongodb://localhost:27017/hkanwal";

var app = express();
var db = mongoose.connection;
var config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// mongoDB connection
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

// session setup
app.use(session({
	secret: config.session_secret,
	resave: true,
	saveUninitialized: true
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/tools", toolsRouter);
app.use("/games", gamesRouter);
app.use("/signup", signUpRouter);
app.use("/login", logInRouter);
app.use("/logout", logOutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
