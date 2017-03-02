window.onload = init();

function init() {
	VK.init(function() { 
		// API initialization succeeded 
		// Your code here 
		console.log('Init app success');
		VK.callMethod("showInstallBox");
	}, function() { 
		// API initialization failed 
		// Can reload page here 
		console.log('Init app failed');
	}, '5.62');
}

function onApplicationAdded() {
	console.log('App added');
}