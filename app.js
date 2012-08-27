/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	catalog = require('./catalog');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

var dataloaded = false;
var data;
var gallery_path = 'public/images/gallery/';
catalog.generate(gallery_path, function(err, images) {
	if(err) throw ex;
	console.log(images.length);
	data = images;
	dataloaded = true;
});

app.get('/', routes.index);

app.get('/imagedata', function(req, res) {
	res.contentType('json');
	if(dataloaded)
		res.send(JSON.stringify(data));
	else
		res.send(JSON.stringify("Not loaded"));
});


http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
