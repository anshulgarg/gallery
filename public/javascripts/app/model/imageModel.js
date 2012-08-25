define('Image',[], function(){
	return Backbone.Model.extend({
		defaults: {
			title: 'Image title',
			description: 'Image description',
			url: 'image-url'
			tags: []
		},
		initialize: function(opts){
			title = opts.title;
			description = opts.description;
			url = opts.url;
			tags = opts.tags;
		}
	});
});