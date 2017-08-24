/**
 * @autor: mr.gifo (vk.com/mr.gifo)
 * áèáëèîòåêà 'myLib' äëÿ òåêóùåãî ïðîåêòà ñ îïèñàíèåì ìåòîäîâ äëÿ ñïåöèôè÷íûõ îáúåêòîâ ñöåíû
 */




var myLib = {

	Terrain: {
		physics: {},
		geometry: {},
		material: {}
	},

	Water: {
		Water,
		geometry: {},
		material: {}
	},

	Sky: {},

	DustFog: {}
	
};





// ìåòîäû äëÿ ðàáîòû ñ Terrain

myLib.Terrain.heightData = function(img, parameters) {
	var minH = parameters.heightMin, maxH = parameters.heightMax;
	var canvas = document.createElement( 'canvas' );
	canvas.width = img.width;
	canvas.height = img.height;
	var size = canvas.width * canvas.height, data = new Float32Array(size);
	var context = canvas.getContext( '2d' );
	context.drawImage(img, 0, 0);
	var imgd = context.getImageData(0, 0, img.width, img.height);
	var pix = imgd.data;
	var height = maxH - minH, j = 0;
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var all = (pix[i] + pix[i+1] + pix[i+2]) / 3;
		data[j++] = minH + (height * all/255);
	}
	return data;	
}

myLib.Terrain.physics.add = function() {
	
}

myLib.Terrain.geometry.create = function(img, heightData, parameters) {
	var geometry = new THREE.PlaneBufferGeometry(parameters.size, parameters.size, img.width - 1, img.height - 1);
	geometry.rotateX(- Math.PI / 2);				
	var vertices = geometry.attributes.position.array;
	for (var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3) {
		vertices[j + 1] = heightData[i];
	}
	geometry.computeVertexNormals();
	return geometry;
}

myLib.Terrain.material.create = function(parameters, terrainMap, terrainMapNormal) {
	terrainMap.wrapS = terrainMap.wrapT = THREE.RepeatWrapping;
	terrainMapNormal.wrapS = terrainMapNormal.wrapT = THREE.RepeatWrapping;
	var repeat = parameters.material.repeatTexture;
	if (repeat > 1) {
		terrainMap.repeat.set(repeat, repeat);
		terrainMapNormal.repeat.set(repeat, repeat);
	}
	var material = new THREE.MeshPhongMaterial({
		color:		parameters.material.color,
		specular:	parameters.material.specular,
		shininess:	parameters.material.shininess,
		map:		terrainMap,	
		normalMap:	terrainMapNormal,
		normalScale:	new THREE.Vector2( 0.8, 0.8 )
	});
	return material;
}




// ìåòîäû äëÿ ðàáîòû ñ Water

myLib.Water.geometry.create = function(parameters) {	
	var k = 0;
	var M = parameters.size;
	var N = parameters.segments;
	var h = parameters.height;
	var hS = parameters.heightScale;
	var geometry = new THREE.PlaneGeometry(M, M, N - 1, N - 1);
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {						
			geometry.vertices[k].x = (i - (N-1)/2) * M/(N-1);
			geometry.vertices[k].y = (Math.cos((i/N) * Math.PI * h) + Math.sin((j/N) * Math.PI * h)) / hS;
			geometry.vertices[k].z = (j - (N-1)/2) * M/(N-1);
			k++;
		}
	}
	return geometry;	
}

myLib.Water.geometry.update = function(geometry, parameters) {
	var k = 0;
	var N = parameters.segments;
	var h = parameters.height;
	var hS = parameters.heightScale;
	var offsetX = parameters.offsetX, offsetY = parameters.offsetY;
	for (var i = 0; i < N; i++) {
		for (var j = 0; j < N; j++) {												
			geometry.vertices[k].y = (Math.cos((offsetX + i/N) * Math.PI * h) + Math.sin((offsetY + j/N) * Math.PI * h)) / hS;
			k++;
		}
	}
	parameters.offsetX += parameters.speedX;
	parameters.offsetY += parameters.speedY;	
}

myLib.Water.update = function(obj) {
	obj.geometry.verticesNeedUpdate = true;				
	obj.material.uniforms.time.value += 1.0 / 60.0;
}

myLib.Water.material.create = function(parameters, waterMapNormal, renderer, camera, scene, light) {
	waterMapNormal.wrapS = waterMapNormal.wrapT = THREE.RepeatWrapping;
	var repeat = parameters.material.repeatTexture;
	if (repeat > 1) waterMapNormal.repeat.set(repeat, repeat);
	var water = new THREE.Water(renderer, camera, scene, {
		textureWidth:	parameters.size,
		textureHeight:	parameters.size,
		waterNormals:	waterMapNormal,
		alpha:		parameters.material.alpha,
		sunDirection:	light.position.clone().normalize(),
		sunColor:	parameters.material.sunColor,
		waterColor:	parameters.material.waterColor,
		distortionScale:parameters.material.distortionScale,
		fog:		scene.fog != undefined
	});
	myLib.Water.Water = water;
	return water.material;
}

myLib.Water.material.shader = function() {
	return myLib.Water.Water;
}




// ìåòîäû äëÿ ðàáîòû ñ Sky

myLib.Sky.add = function(parameters, renderer, scene, camera) {	
	var sky = new THREE.Sky();
	scene.add(sky.mesh);				
	var sunSphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry(20000, 16, 8),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	sunSphere.position.y = - 700000;
	sunSphere.visible = false;
	scene.add(sunSphere);				
	settings_Sky();
	function settings_Sky() {
		var uniforms = sky.uniforms;
		uniforms.turbidity.value = parameters.turbidity;
		uniforms.rayleigh.value = parameters.rayleigh;
		uniforms.luminance.value = parameters.luminance;
		uniforms.mieCoefficient.value = parameters.mieCoefficient;
		uniforms.mieDirectionalG.value = parameters.mieDirectionalG;
		var distance = parameters.distanceSun;
		var theta = Math.PI * (parameters.inclination - 0.5);
		var phi = 2 * Math.PI * (parameters.azimuth - 0.5);
		sunSphere.position.x = distance * Math.cos(phi);
		sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
		sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
		sunSphere.visible = parameters.sun;
		sky.uniforms.sunPosition.value.copy(sunSphere.position);
		renderer.render(scene, camera);
	}	
}




// ìåòîäû äëÿ ðàáîòû ñ DustFog

myLib.DustFog.create = function(width, height, depth, texture, scale, total, color, alpha, blendMode) {	
	var blendings = [ "NoBlending", "NormalBlending", "AdditiveBlending", "SubtractiveBlending", "MultiplyBlending" ];
	var blending = blendings[blendMode];
	var particleGroup = new THREE.Object3D();
	var spriteMaterial = new THREE.SpriteMaterial({
		map: texture,
		useScreenCoordinates: false,
		color: color,
		fog: true
	});					
	var wScale, hScale, wh = texture.image.width / texture.image.height;					
	wScale = wh <= 1 ? wh : 1;
	hScale = wh <= 1 ? 1 : 1/wh;					
	for (var i = 0; i < total; i++) {						
		var sprite = new THREE.Sprite(spriteMaterial);						
		sprite.scale.set(wScale * scale, hScale * scale, 1.0);
		sprite.opacity = alpha;
		sprite.material.blending = THREE[blending];
		sprite.position.set(Math.random() * width - width/2, Math.random() * height - height/2, Math.random() * depth - depth/2);
		particleGroup.add(sprite);
	}					
	return particleGroup;
}









