// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var path = require('path');
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.apiKey);
var loadDetails = {
  0: {name: "",
      address: "",
      phone: ""
     },
  1: {name: "",
      address: "",
      phone: ""
     },
  2: {name: "",
      address: "",
      phone: ""
     },
  3: {name: "",
      address: "",
      phone: ""
     },
  4: {name: "",
      address: "",
      phone: ""
     }
};
var userDetails = {};
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + process.env.dbuser + ':' + process.env.dbpswd + '@ds117701.mlab.com:17701/nightcoord';
//https://www.npmjs.com/package/passport
//https://www.npmjs.com/package/passport-twitter
function insertGoing(venue, user){
  MongoClient.connect(url, function(err, mongoclient){
     var db = mongoclient.db('nightcoord');
     var venues = db.collection('venues');
     venues.insert({'name': user, 'place': venue});
     mongoclient.close();
  });
}
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
  if (req.query.rad == undefined){
    res.render("index", {user: req.user});
  } else if(req.query.signed != undefined){
    client.search({
      term: req.query.rad,
      latitude: parseFloat(req.query.lat),
      longitude: parseFloat(req.query.long),
      radius: 20000,
      limit: 5
    }).then(response => {
      console.log(response.jsonBody.businesses);
      //setup object creation
      for (var i = 0; i < response.jsonBody.businesses.length; i++){
          loadDetails[i].name = response.jsonBody.businesses[i].name
          loadDetails[i].address = response.jsonBody.businesses[i].location.address1;
          loadDetails[i].phone = response.jsonBody.businesses[i].phone;
      }
      console.log(loadDetails);
      userDetails = {1: loadDetails, 2: req.user};
      res.render("index", {userDetails});
    }).catch(e => {
      console.log(e);
   });
            
            
  }else{
  client.search({
      term: req.query.rad,
      latitude: parseFloat(req.query.lat),
      longitude: parseFloat(req.query.long),
      radius: 20000,
      limit: 5
    }).then(response => {
      console.log(response.jsonBody.businesses);
      //setup object creation
      for (var i = 0; i < response.jsonBody.businesses.length; i++){
          loadDetails[i].name = response.jsonBody.businesses[i].name
          loadDetails[i].address = response.jsonBody.businesses[i].location.address1;
          loadDetails[i].phone = response.jsonBody.businesses[i].phone;
      }
      console.log(loadDetails);  
      res.render("index", {loadDetails});
    }).catch(e => {
      console.log(e);
   });
  }
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
app.get('/going', function(req, res){
   //insertGoing('name', 'place');
    res.end();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
