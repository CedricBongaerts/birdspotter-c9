// Init Express Web Framework
var express = require('express');
var app = express();
var path = require('path');

// Set view engine to EJS & set views directory
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'client', 'views'));

app.use(express.static(path.resolve(__dirname, 'client')));

// Database Connection
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

// Main route
app.get('/', function(req, res){
    res.render('index.ejs');
});

// // catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// API 
var api = express.Router();
require('./server/routes/capture')(api);
app.use('/api', api);

// Set routes to other pages
app.get('/*', function(req, res){
    app.use(express.static(path.join(__dirname, 'client')));
});

// Port Settings
app.listen(process.env.PORT || 3000, process.env.IP);
console.log('Listening on port ' + process.env.PORT);