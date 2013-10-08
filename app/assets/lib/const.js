

var indWin = null;
var msglbl = null;
Ti.App.showIndicator = null;
Ti.App.hideIndicator = null;
if (Titanium.Platform.osname == "iphone") {
	//indicator
	var indicator_iphone = require("/lib/busy_indicator/indicator_iphone");
	indWin = new indicator_iphone();
	Ti.App.showIndicator = function(message) {
		indWin.children[1].children[1].text = (message != "" && message != null) ? message : "Loading...";
		if (indWin != null) {
			indWin.close({
				opacity : 0,
				duration : 450
			});
		}
		indWin.open({
			opacity : 1,
			duration : 450
		});

	}
	Ti.App.hideIndicator = function(message) {
		if (indWin != null) {
			indWin.close({
				opacity : 0,
				duration : 450
			});
		}
	}
} else {

	Ti.App.activityIndicator_android = Ti.UI.Android.createProgressIndicator({
		location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG, 
		type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT 
	});
	Ti.App.showIndicator = function(message) {
		message = "Loading...";
		Ti.App.activityIndicator_android.message = message;
		Ti.App.activityIndicator_android.show();
	}
	Ti.App.hideIndicator = function(message) {
		Ti.App.activityIndicator_android.hide();
	}
}
