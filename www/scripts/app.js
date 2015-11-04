(function(global) {
	var mobileSkin = "flat",
		app = global.app = global.app || {};

	document.addEventListener("online", function() {
		console.log("Status online");
	}, false);
	document.addEventListener("offline", function() {
		console.log("Status offline");
	}, false);

	document.addEventListener('deviceready', function () {
	    console.log("deviceready");
	    
		var os = kendo.support.mobileOS;
		console.log("os version :" + os.flatVersion);
		if (os.ios && os.flatVersion >= 700) {
		    //alert('ios');
		    localStorage.setItem("OS", "ios");
		    StatusBar.overlaysWebView(false);
		} else {
		    //alert('android');
		    localStorage.setItem("OS", "android");
		    document.addEventListener("backbutton", app.loginService.viewModel.onBackKeyDown, false);
		}

		var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
		telephoneNumber.get(function (result) {
		    app.loginService.viewModel.MOBILE_NO = result;
		    //alert('Phone No. :: ' + result);
		}, function () {
		    //alert("Phone No. :: Not Found.");
		});
		
		
		

		//var networkState = navigator.connection.type;
        //if (networkState == Connection.NONE) {
		//	app.loginService.viewModel.set("isOffline", true);
		//	console.log("Initial offline");
		//}
		
		
		//if (window.plugins.backgroundGeoLocation) {
		//	app.backgroundService.configureBackgroundGeoLocation();
		//	console.log("Device : configureBackgroundGeoLocation");
		//} else {
		//	navigator.notification.alert("Error",
		//		function() {}, "Background location failed", 'OK');
		//}

		//var server = app.configService.serviceUrl;
		//var fingerprint = app.configService.fingerprint; // valid until sep 2014

		//window.plugins.sslCertificateChecker.check(
		//	function() {
		//		console.log("Conection Secure")
		//	},
		//	function(message) {
		//		if (message == "CONNECTION_NOT_SECURE") {
		//			console.log("Connection not Secure")
		//			navigator.notification.alert("Connection not secure",
		//				function() {}, "Security error", 'OK');
		//		} else if (message == "CONNECTION_FAILED") {
		//			app.loginService.viewModel.set("isOffline", true);
		//			console.log("Initial offline");
		//		}
		//	},
		//	server,
		//	fingerprint);
		//navigator.splashscreen.hide();
	}, false);

	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

	app.application = new kendo.mobile.Application(document.body, {
		layout: "Login-layout",
		skin: 'flat'
	});

	app.changeSkin = function(e) {
		if (e.sender.element.text() === "Flat") {
			e.sender.element.text("Native");
			mobileSkin = "flat";
		} else {
			e.sender.element.text("Flat");
			mobileSkin = "";
		}

		app.application.skin(mobileSkin);
	};

    app.backgroundService = {
		configureBackgroundGeoLocation: function() {
		}
	}

})(window);
