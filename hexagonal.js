/**
 * @author Thibaut Despoulain / http://bkcore.com
 * Hexagonal Vignette shader
*/

var bkcore = bkcore || {};

bkcore =
{
	'hexvignette': {

		uniforms: {

			tDiffuse: { type: "t", value: 0, texture: null },
			tHex: {type: "t", value: 1, texture: null},
			sizeW: {type: "f", value: 1920.0}, //
			sizeH: {type: "f", value: 1080.0}, //
			rx: {type: "f", value: 1024.0},
			ry: {type: "f", value: 768.0},
			color: {type: "c", value: new THREE.Color(0x458ab1)}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",
				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float sizeW;", //
			"uniform float sizeH;", //
			"uniform float rx;",
			"uniform float ry;",

			"uniform vec3 color;",

			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tHex;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 vcolor = vec4(color,1.0);",

				"vec2 hexuv;",
				"hexuv.x = 1.0;", //
				"hexuv.y = 1.0;", //
				"vec4 hex = texture2D( tHex, hexuv );",

				"float tolerance = 0.2;",
       				"float vignette_size = 0.6;",
        			"vec2 powers = pow(abs(vec2(vUv.x - 0.5,vUv.y - 0.5)),vec2(2.0));",
        			"float radiusSqrd = vignette_size*vignette_size;",
        			"float gradient = smoothstep(radiusSqrd-tolerance, radiusSqrd+tolerance, powers.x+powers.y);",

				"vec2 uv = ( vUv - vec2( 0.5 ) );",

				"vec2 sample = uv * gradient * 0.5 * (1.0-hex.r);",

				"vec4 texel = texture2D( tDiffuse, vUv-sample );",
				"gl_FragColor = (((1.0-hex.r)*vcolor) * 0.5 * gradient) + vec4( mix( texel.rgb, vcolor.xyz*0.7, dot( uv, uv ) ), texel.a );",

			"}"

		].join("\n")

	}
}
