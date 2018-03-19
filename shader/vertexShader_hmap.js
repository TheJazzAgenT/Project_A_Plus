var vertexShader_hmap = `
precision mediump float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;
uniform float displaceAmt;
uniform sampler2D texHmap;
uniform sampler2D texNoise;
uniform float time;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying float vDisplace;
varying vec3 v_reflected;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 N, L1, V;

void phoneIllumination(vec3 pos)
{
  //get the vertex position in CAMERA coordinates
  vec4 position_c = viewMatrix * modelMatrix * vec4(pos, 1.0);

  vec3 light1_pos = vec3(0.0, 10.0, 0.0);
  //use xyz vals to calculate vectors between vertex, light, and camera
	vec3 P = position_c.xyz;

	//get the normalized vertex normal in CAMERA coordinates
	N = vec3(normalize(viewMatrix * modelMatrix * vec4(normal.xyz, 0.0)  ).xyz) ;

	//the lights positions are defined in WORLD coordinates, we want to put them in CAMERA coordinates too
	vec4 L1_cam = viewMatrix * vec4(light1_pos, 1.0);

	//get the normalized vectors from each light position to the vertex positions
	L1 = vec3(normalize(L1_cam - position_c).xyz);

	//reverse direction of position vector to get view vector from vertex to camera
	V = normalize(-P);
}

void main() {
  vUv = uv;
  float avgDist = 0.016;
  vec4 clr = texture2D(texHmap, uv);
  vec4 ref1 = texture2D(texHmap, uv + vec2(avgDist, avgDist));
  vec4 ref2 = texture2D(texHmap, uv + vec2(-avgDist, -avgDist));
  vec4 ref3 = texture2D(texHmap, uv + vec2(avgDist, -avgDist));
  vec4 ref4 = texture2D(texHmap, uv + vec2(-avgDist, avgDist));
  vec4 ref5 = texture2D(texHmap, uv + 0.5 * vec2(avgDist, avgDist));
  vec4 ref6 = texture2D(texHmap, uv + 0.5 * vec2(-avgDist, -avgDist));
  vec4 ref7 = texture2D(texHmap, uv + 0.5 * vec2(avgDist, -avgDist));
  vec4 ref8 = texture2D(texHmap, uv + 0.5 * vec2(-avgDist, avgDist));
  clr.r = (clr.r + ref1.r + ref2.r + ref3.r + ref4.r + ref5.r + ref6.r + ref7.r + ref8.r) / 9.0;

  vDisplace = clr.r * displaceAmt*30.0;
  vec3 newPosition = position.xyz + normal.xyz * vDisplace;
  phoneIllumination(newPosition);
  vPosition = newPosition;

  // // Calculate position in the world coordinate system
  // vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  // // Calculate normal in the world coordinate system
  // vec3 worldNormal = mat3(modelMatrix[0].xyz,
  //                         modelMatrix[1].xyz,
  //                         modelMatrix[2].xyz) * normal;
  // // Calculate the incident vector
  // vec3 incident = worldPosition.xyz - cameraPosition;
  // v_reflected = reflect(incident, normalize(worldNormal));

  gl_Position = projectionMatrix  * viewMatrix * modelMatrix  * vec4( newPosition, 1.0 );

}`;
