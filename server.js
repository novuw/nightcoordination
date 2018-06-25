// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var path = require('path');

//https://www.npmjs.com/package/passport
//https://www.npmjs.com/package/passport-twitter

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
passport.use(new Strategy({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  callbackURL: 'https://nightcoordination.glitch.me/twitter/return'
}, function(token, tokenSecret, profile, callback){
  return callback(null, profile);
}));

passport.serializeUser(function(user, callback){
  callback(null, user);
});


passport.deserializeUser(function(obj, callback){
  callback(null, obj);
});
app.use(express.static('public'));


app.use(session({
  secret: 'whatever',
  resave: true,
  saveUnitialized: true
}));




//passport.authenticate('twitter'){failureRedirect: PATH}



/*
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/callback.html", function(req, res){
  res.sendFile(__dirname + '/views/callback.html');
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/views/index.html');
  res.render("index", {user: req.user});
});

app.get('/twitter/login', passport.authenticate('twitter'));
app.get('/twitter/return', passport.authenticate('twitter', {
  failureRedirect: '/'
}), function(req, res){
  res.redirect('/');
});
/*app.post('/indexx', function(req, res){
  res.render("indexx");
});*/



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
