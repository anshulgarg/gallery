require(['javascripts/app/view/imageGalleryView'],function(GalleryView){
		window.gallery = new GalleryView({
			container: $('#gallery'),
			mainimage: $('#mainimage'),
			tagsContainer: $('#tags')
		});
});