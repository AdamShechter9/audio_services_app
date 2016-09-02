var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client')));

app.use(session({
	secret: 'chromawave',
}));  // string for encryption

// DB Config file
require('./server/config/mongoose.js');
// Routes
var routesetter = require('./server/config/routes.js');
routesetter(app);

app.listen(8000, function () {
	console.log('cool stuff on: 8000');
})