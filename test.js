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
		VK.api("users.get", {fields: "photo_200"}, function (data) { 
			//for(var i=0; i<data.response.length; i++) {
			if (data.response) {
				console.log(data.response[0].photo_200);
			}			
			//}
		});
		start_pixi();
	}, function() { 
		// API initialization failed 
		// Can reload page here 
		console.log('Init app failed');
	}, '5.62');
}

function init() {
	var count = 0;

	var renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.view);
	var stage = new PIXI.Stage;
	
	//var app = new PIXI.Application();
	//document.body.appendChild(app.view);

	var texture = PIXI.Texture.fromImage('zb-video.png');
	var points = new Float32Array([50, 50, 600, 50, 600, 150, 50, 50, 600, 150, 50, 150]);
	var newUVS = new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);
	var indices = new Uint16Array([0, 1, 2, 3, 4, 5]);

	var strip = new PIXI.mesh.Mesh(texture, points, newUVS, indices, PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES);

	//app.stage.addChild(strip);
	stage.addChild(strip);
	
	//app.ticker.add(function() {
	//}); 
	document.addEventListener('click', onDocumentMouseClick, false);
	function draw() {
		renderer.render(stage);
		requestAnimationFrame(draw);
	}
	draw();
	
	function onDocumentMouseClick( event ) {
		points[0] = points[0] + 1;
		points[3] = points[3] + 1;
		points[1] = points[1] - 1;
		
		points[2] = points[2] + 2;
		points[5] = points[5] - 2;
		count++;
		console.log(count);
	}
	
}

//function onApplicationAdded() {
//	console.log('App added');
//}
 
