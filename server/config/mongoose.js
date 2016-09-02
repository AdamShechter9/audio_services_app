// require mongoose
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

// connect to DB
mongoose.connect('mongodb://localhost/warp9_audio_services_db');

var models_path = path.join(__dirname, '../models');

// read all files in models_path and if JS file, require it
fs.readdirSync(models_path).forEach(function (file) {
	if (file.indexOf('.js') > 0) {
		require(models_path + '/' + file);
	}
})
