define(['javascripts/app/collection/imagesCollection'], function(imagesCollection) {
	return Backbone.View.extend({
		initialize: function(opts) {
			this.container = opts.container;
			this.mainimage = opts.mainimage;
			this.tagsContainer = opts.tagsContainer;
			this.loadImageData();
			_.bindAll(this);
		},
		loadImages: function(images) {
			var self = this;
			this.imageData = images;
			$.each(images, function(index, image) {
				self.container.append("<img src='" + image.path_small + "' p_src='"+image.path_large+"'></img>");
			});

			$.each(self.container.find("img"), function(index, elem){
				$(elem).on('click', function(args){
					self.mainimage.attr('src',$(this).attr('p_src'));
					self.container.find('.current').removeClass('current');
					$(this).addClass('current');
				});
			});

			self.container.find("img").get(0).click();
		},
		loadImageData: function() {
			var self = this;
			$.ajax("/imagedata").done(function(data) {
				self.images = data;
				self.loadImages(data);
				self.renderTags();
				self.addNavigation();
			});
		},
		reset: function(){
			this.container.empty();
			this.mainimage.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
		},
		renderTags: function(){
			var self = this;
			var tags = [];
			self.maxOccurrence = 0;

			$.each(self.images, function(index,image){
				$.each(image.tags, function(index,tag){
					tags[tag] = tags[tag] == null ? 1 : tags[tag] + 1;	
					self.maxOccurrence = tags[tag] > self.maxOccurrence ? tags[tag] : self.maxOccurrence;
				});
				
			});
			for(key in tags){
				self.tagsContainer.append("<a href='#' style='font-size: "+self.calculateFontSize(tags[key])+"%;'>"+key+"</a>&nbsp;");
			}

			$.each(self.tagsContainer.find('a'), function(index, a){
				$(a).on('click', self.filterByTag);	
			});	
			
		},
		calculateFontSize: function(tagOccurrence){
			var max = this.maxOccurrence;
			return (150.0*(1.0+(1.5*tagOccurrence-max/2)/max));
		},
		filterByTag: function(args){
			var self = this;
			var clickedtag = $(args.target).text();
			var images = $.grep(self.images, function(img){
				return $.inArray(clickedtag, img.tags) > -1;
			}); 
			self.reset();
			self.loadImages(images);
		},
		addNavigation: function(){
			var self = this;
			$('body').keyup(function (event) {
    			var direction = null;

    			// handle cursor keys
			    if (event.keyCode == 37) {
			      // slide left
			      direction = 'prev';
			    } else if (event.keyCode == 39) {
			      // slide right
			      direction = 'next';
			    }

			    if (direction != null) {
			      self.container.find('.current')[direction]().click();
    			}
  			});
		}


	});
});
