window.onload = init();
 
var app_added = false;
 
function init() {
	VK.init(function() { 
		// API initialization succeeded 
		// Your code here 
		console.log('Init app success');
		VK.callMethod("showInstallBox");
		VK.addCallback('onApplicationAdded', function () { 
			app_added = true;
			console.log('App added');
		});
		VK.api("users.get", {fields: "photo_300"}, function (data) { 
			//for(var i=0; i<data.response.length; i++) {
			if (data.response) {
				console.log(data.response[0].photo_300);
			}			
			//}
		});
	}, function() { 
		// API initialization failed 
		// Can reload page here 
		console.log('Init app failed');
	}, '5.62');
}

//function onApplicationAdded() {
//	console.log('App added');
//}
 
