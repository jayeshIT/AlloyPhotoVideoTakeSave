Titanium.include('/lib/const.js');
$.btn1.addEventListener('click', function(e) {
	Camera_iphone();
});
var Myfolder = null;
if (Titanium.Platform.osname != 'android') {
	Myfolder = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), 'media');
} else {
	if (Ti.Filesystem.isExternalStoragePresent() == true) {
		Myfolder = Ti.Filesystem.getFile(Titanium.Filesystem.getExternalStorageDirectory(), 'media');
	} else {
		Myfolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'media');
	}
}
Titanium.API.info('NativePath:' + Myfolder.nativePath);

var file = null;
var media_type = null;
var video_camera = null;
var image_camera = null;
var file_video = null;

var Camera_iphone = function() {

	Titanium.Media.showCamera({
		success : function(event) {
			media_type = null;
			video_camera = null;
			image_camera = null;
			current_time = new Date().getTime();
			Ti.App.showIndicator();
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				try {
					file = null;
					media_type = 'image';
					if (!Myfolder.exists()) {
						Myfolder.createDirectory();
					}
					var imageDir = Titanium.Filesystem.getFile(Myfolder.resolve(), "photos");
					var tmp_currentTime = null;
					tmp_currentTime = current_time;
					if (!imageDir.exists()) {
						imageDir.createDirectory();
						file = Titanium.Filesystem.getFile(imageDir.resolve(), tmp_currentTime + 'camera_photo.png');
						file.write(event.media);
					} else {
						file = Titanium.Filesystem.getFile(imageDir.resolve(), tmp_currentTime + 'camera_photo.png');
						file.write(event.media);
					}
					var ImageFactory = require('ti.imagefactory');
					image_camera = ImageFactory.imageAsResized(file.read(), {
						width : 700,
						height : 700
					});

					var origimg = null;
					var blob_rn = null;

					blob_rn = ImageFactory.imageAsResized(file.read(), {
						width : 100,
						height : 100,
					});
					ImageFactory = null;
					var thumbDir = Titanium.Filesystem.getFile(Myfolder.resolve(), "thumb");
					Titanium.API.info('thum===============');
					if (!thumbDir.exists()) {
						thumbDir.createDirectory();
						file = Titanium.Filesystem.getFile(thumbDir.resolve(), tmp_currentTime + 'camera_photo.png');
						file.write(blob_rn);
					} else {
						file = Titanium.Filesystem.getFile(thumbDir.resolve(), tmp_currentTime + 'camera_photo.png');
						file.write(blob_rn);
					}
					Titanium.API.info('thum=============is ok=====');
					blob_rn = null;
					create_gallery();
				} catch(exp) {
					Ti.App.hideIndicator();
					Ti.API.info("error: " + exp.error);
					alert(" Your device memmory is not enough to process further. Please close other applications to free memory..");
				}
			} else {
				try {
					file_video = null;
					var ImageFactory = require('ti.imagefactory');
					media_type = 'video';
					video_camera = event.media;
					if (!Myfolder.exists()) {
						Myfolder.createDirectory();
					}
					var imageDir = Titanium.Filesystem.getFile(Myfolder.resolve(), "photos");

					if (!imageDir.exists()) {
						imageDir.createDirectory();
						file_video = Titanium.Filesystem.getFile(imageDir.resolve(), current_time + 'm_video.mov');
						file_video.write(video_camera);
					} else {
						file_video = Titanium.Filesystem.getFile(imageDir.resolve(), current_time + 'm_video.mov');
						file_video.write(video_camera);
					}

					video_plyear_my = Titanium.Media.createVideoPlayer({
						autoplay : false,
						sourceType : Titanium.Media.VIDEO_SOURCE_TYPE_STREAMING,
						scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
						mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
						media : event.media
					});
					var th = video_plyear_my.thumbnailImageAtTime(1, Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME);
					var blob_rn = null;
					var origimg = th;
					blob_rn = ImageFactory.imageAsResized(origimg, {
						width : 100,
						height : 100
					});
					ImageFactory = null;
					var thumbDir = Titanium.Filesystem.getFile(Myfolder.resolve(), "thumb");
					if (!thumbDir.exists()) {
						thumbDir.createDirectory();
						file = Titanium.Filesystem.getFile(thumbDir.resolve(), current_time + 'c_video.png');
						file.write(blob_rn);
					} else {
						file = Titanium.Filesystem.getFile(thumbDir.resolve(), current_time + 'c_video.png');
						file.write(blob_rn);
					}
					blob_rn = null;
					create_gallery();
				} catch(ex) {
					Ti.App.hideIndicator();
					Ti.API.info("Exception videos: " + exp.error);
					alert(" Your device memmory is not enough to process further. Please close other applications to free memory..");
				}
			}
		},
		cancel : function() {
			Ti.App.hideIndicator();
		},
		error : function(error) {
			Ti.App.hideIndicator();
			if (error.code == Titanium.Media.NO_CAMERA) {
				alert('No camera detected.');
			} else {
				alert('Unexpected error.');
			}
		},
		allowEditing : true,
		videoQuality : Titanium.Media.QUALITY_LOW,
		mediaTypes : (Titanium.Platform.osname == "android") ? [Titanium.Media.MEDIA_TYPE_PHOTO] : [Titanium.Media.MEDIA_TYPE_VIDEO, Titanium.Media.MEDIA_TYPE_PHOTO]
	});
}
/// Gallery function
var mainScroll = Titanium.UI.createScrollView({
	top : 50,
	bottom : 0,
	width : 320,
	contentHeight : 'auto',
	contentWidth : 'auto',
	showVerticalScrollIndicator : true,
	borderColor : 'red'
});
var thumbdir = null;
var photodir = null;
var dirFullPath = null;
var dirFullPath_photo = null;
var firsttime = true;
var create_gallery = function() {
	if (firsttime == false) {
		var mbottom = mainScroll.bottom;
		if (mainScroll != null) {
			$.index.remove(mainScroll);
			mainScroll = null;
		}
		mainScroll = Titanium.UI.createScrollView({
			top : 50,
			bottom : 0,
			width : 320,
			contentHeight : 'auto',
			contentWidth : 'auto',
			showVerticalScrollIndicator : true,
			borderColor : 'red'
		});
		mainScroll.bottom = mbottom;
	}
	firsttime = false;
	var folderimage = [];
	bigArray = [];
	thumbarr = [];
	thumbdir = null;
	photodir = null;
	dirFullPath = null;
	dirFullPath_photo = null;

	if (Titanium.Platform.osname == 'iphone') {
		dirFullPath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'media' + Ti.Filesystem.separator + 'thumb';
		thumbdir = Titanium.Filesystem.getFile(dirFullPath);
		dirFullPath_photo = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + 'media' + Ti.Filesystem.separator + 'photos';
		photodir = Titanium.Filesystem.getFile(dirFullPath_photo);
	} else {
		thumbdir = Titanium.Filesystem.getFile(Myfolder.resolve(), "thumb")
		photodir = Titanium.Filesystem.getFile(Myfolder.resolve(), "photos")
	}

	if (thumbdir.exists()) {
		var folderimage = thumbdir.getDirectoryListing();
		var folderphoto = photodir.getDirectoryListing();
		var topHeight = 5;
		var leftWidth = 13;
		var p = 4;
		var q = 0;
		for (var i = 0; i < folderimage.length; i++) {
			var fobj = Titanium.Filesystem.getFile(thumbdir.resolve(), folderimage[i]);
			var photo_obj = Titanium.Filesystem.getFile(photodir.resolve(), folderphoto[i]);
			var path = photo_obj.nativePath;
			var imageView_big = null;
			if (path.indexOf(".png") > -1 || path.indexOf(".JPG") > -1) {
				imageView_big = Titanium.UI.createImageView({
					width : Ti.UI.FILL,
					height : Ti.UI.FILL,
					image : photo_obj.nativePath,
				});
			} else {
				imageView_big = Titanium.Media.createVideoPlayer({
					width : Ti.UI.FILL,
					height : Ti.UI.FILL,
					backgroundImage : fobj.nativePath,
					autoplay : false,
					media : photo_obj.nativePath,
					sourceType : Titanium.Media.VIDEO_SOURCE_TYPE_STREAMING,
					scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
					mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT
				});
			}
			if (Titanium.Platform.osname == 'iphone') {
				bigArray.push(imageView_big);
			} else {
				bigArray.push(photo_obj.nativePath);
				thumbarr.push(fobj.nativePath);
			}
			if (folderimage.length < p) {
				p = folderimage.length;
			}
			if (q < p) {
				var view = Titanium.UI.createView({
					height : 70,
					width : 70
				});
				view.top = topHeight;
				view.name = "asset";
				view.left = leftWidth;
				view.id = i;
				imageView = Titanium.UI.createImageView({
					height : 67,
					width : 67,
					borderColor : 'white',
					borderWidth : 2
				});
				imageView.name = "asset";
				imageView.image = fobj.nativePath;
				imageView.id = i;
				view.add(imageView);
				mainScroll.add(view);
			}
			q = q + 1;
			if (q == 1) {
				leftWidth = leftWidth + 75;
			}
			if (q == 2) {
				leftWidth = leftWidth + 75;
			}
			if (q == 3) {
				leftWidth = leftWidth + 75;
			}
			if (q == 4) {
				q = 0;
				leftWidth = 13;
				topHeight = topHeight + 75;
			}
		};
		Ti.App.hideIndicator();
	} else {
		Ti.App.hideIndicator();
	}
	$.index.add(mainScroll);

}

$.index.open();
