define(['javascripts/app/collection/imagesCollection'], function(imagesCollection) {
	return Backbone.View.extend({
		initialize: function(opts) {
			this.container = opts.container;
			this.mainimage = opts.mainimage;
			this.tagsContainer = opts.tagsContainer;
			this.tags = [];
			this.loadImageData();
			_.bindAll(this);
		},
		loadImages: function(images) {
			var self = this;
			$.each(images, function(index, image) {
				self.container.append("<img src='" + image.path_small + "' p_src='"+image.path_large+"'></img>");
			});

			$.each(self.container.find("img"), function(index, elem){
				$(elem).on('click', function(args){
					self.mainimage.attr('src',$(this).attr('p_src'));
				});
			});
		},
		loadImageData: function() {
			var self = this;
			$.ajax("/imagedata").done(function(data) {
				self.images = data;
				self.loadImages(data);
				self.renderTags();
			});
		},
		reset: function(){
			this.container.empty();
			this.mainimage.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
		},
		renderTags: function(){
			var self = this;
			$.each(self.images, function(index,image){
				self.tags = $.unique($.merge(self.tags, image.tags));
			});

			$.each(self.tags, function(index, tag){
				self.tagsContainer.append("<a href='#'>"+tag+"</a>&nbsp;");
			});

			$.each(self.tagsContainer.find('a'), function(index, a){
				$(a).on('click', self.filterByTag);	
			});	
			
		},
		filterByTag: function(args){
			var self = this;
			var clickedtag = $(args.target).text();
			var images = $.grep(self.images, function(img){
				return $.inArray(clickedtag, img.tags) > -1;
			}); 
			self.reset();
			self.loadImages(images);
		}

	});
});
