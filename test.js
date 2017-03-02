window.onload = init();

var app_added = false;
 
function init() {
	VK.init(function() { 
		// API initialization succeeded 
		// Your code here 
		console.log('Init app success');
		VK.callMethod("showInstallBox");
		VK.addCallback('onApplicationAdded', function f() { 
			app_added = true;
			console.log('App added');
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
