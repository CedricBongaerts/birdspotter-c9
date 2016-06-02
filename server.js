// Birdspotter
// Author: Cedric Bongaerts
// NodeJS Server

// Init Express Web Framework
var express = require('express');
var app = express();
var path = require('path');


// Set view engine to EJS & set views directory
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Database Connection
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
require('./server/routes/capture');
require('./server/routes/comment');
require('./server/routes/vote');
require('./server/routes/follow');
mongoose.connect(configDB.url);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

// Main route
app.get('/', function(req, res){
    res.render('index.html');
});

app.get('/birds', function(req, res){
    res.render('webtest.json');
});

// API 
var api = express.Router();
require('./server/routes/capture')(api);
require('./server/routes/comment')(api);
require('./server/routes/vote')(api);
require('./server/routes/follow')(api);
app.use('/api', api);

// Port Settings
app.listen(process.env.PORT || 3000, process.env.IP);
console.log('Listening on port ' + process.env.PORT);