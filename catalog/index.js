var ex = require('exiv2');
var fs = require('fs');
var im = require('imagemagick');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var catalogEventEmitter = new EventEmitter();

var DIR = 'public/images/gallery/';
var DIR_TH =  DIR + 'thumbs/';

var images = [];
exports.generate = function(dir, callback) {
	catalogEventEmitter.on("images-loaded", function(images) {
		callback(null, images);
	});

	readAllImagePathsFromDir(DIR, function(err, imagepaths) {
		var count = imagepaths.length;
		imagepaths.forEach(function(imagepath) {
			extractMetadata(imagepath, function(err, metadata) {
				if (err) {
					console.log("Failed for:" + imagepath);
				} else {
					imgdata = {
						path: imagepath,
						tags: metadata
					}
					images.push(createImageFromMetadata(imgdata));
					
				}

			});

		});
		
		imagepaths.forEach(function(imagepath){
			generateThumbnail(imagepath, function(err, result){
				if(err) throw err;
				count--;
				if (count == 0) catalogEventEmitter.emit('images-loaded', images);
			});
		});
	});
}

function readAllImagePathsFromDir(dir, callback) {
	var imagepaths = [];
	fs.readdir(dir, function(err, list) {
		list.forEach(function(filepath) {
			if (filepath.split(".")[1] == 'jpg') {
				imagepaths.push(filepath);
			}
		});
		callback(null, imagepaths);
	});
}

function extractMetadata(imgpath, callback) {
	ex.getImageTags(DIR +  imgpath, function(err, tags) {
		if (err) callback(err, null);
		callback(null, tags);
	});
}

function generateThumbnail(imgpath, callback) {
	im.resize({
	  srcPath: DIR + imgpath,
	  dstPath: DIR_TH + imgpath.replace('.jpg', '_t.jpg'),
	  width:   128
	}, function(err, stdout, stderr){
	  if (err) throw err
	  callback(null,'done');
	});
}


function createImageFromMetadata(imgdata) {
	return new Image({
		title: imgdata.tags['Iptc.Application2.ObjectName'] || "",
		created: imgdata.tags['Exif.Photo.DateTimeOriginal'] || "",
		path_large: DIR.replace('public/','') + imgdata.path,
		path_small: DIR_TH.replace('public/','') + imgdata.path.replace('.jpg', '_t.jpg'),
		tags: imgdata.tags['Xmp.dc.subject'] ? imgdata.tags['Xmp.dc.subject'].split(",") : []
	});
}

function Image(opts) {
	this.title = opts.title;
	this.created = opts.created;
	this.path_large = opts.path_large;
	this.path_small = opts.path_small;
	this.tags = opts.tags;
}
//Iptc.Application2.ObjectName => title
//Exif.Photo.DateTimeOriginal => date taken
