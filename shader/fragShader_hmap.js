var fragShader_hmap = `


precision mediump float;
uniform sampler2D texNoise;
uniform sampler2D texNormal;
uniform samplerCube skyBox;
varying vec3 v_reflected;

varying vec3 vPosition;

varying vec2 vUv;
varying float vDisplace;
varying vec3 V, N, L1;
float spec_intensity = 16.0; //higher value indicates more rapid falloff

float noise( in vec2 x) {
    vec2 f = fract(x);
	return -1.0 + 2.0*texture2D( texNoise, ((floor(x) + f.xy*f.xy*(3.0-2.0*f.xy))+0.5)/256.0).x;
}


vec4 phoneIllumination()
{
  vec4 outColor1 = vec4(0.0);
  vec3 ambient = vec3(0.7,0.78,0.9);
  vec3 light1_diffuse = vec3(0.1, 0.1, 0.1);
	vec3 light1_specular = vec3(0.1, 0.1, 0.1);
  //diffuse light depends on the angle between the light and the vertex normal
	float diff1 = max(0.0, dot(N, L1)); //just to make sure not negative
	vec3 color1 = diff1 * light1_diffuse;
  //specular highlights depend upon the position/orientation of the camera and the direction of the light reflecting off of this geometry
	vec3 R1 = normalize(reflect(-L1,N)); //get light vector reflected across the plane defined by the normal of this geometry
	float spec1 = pow( max(dot(R1, V), 0.0), spec_intensity); //raising the value to a particular intensity value shrinks the size of the specular highlight so that only a reflection vector (R1) that is very close to the view vector (V) will be applied to this fragment.
	color1 += spec1 * light1_specular;
  if (spec1 > 1.0) {
  		outColor1 = vec4(light1_specular,1.0);
	} else {
  		outColor1 = clamp(vec4(color1,1.0), 0.0,1.0);
	}
  vec4 color = clamp(vec4(ambient, 1.0) + outColor1, 0.0, 1.0);
  return color;
}

float calcOcc( in vec3 pos, in vec3 nor ) {
    vec3 aopos;
	float hr=0., dd=0., totao = 0.;
    for(int aoi=0; aoi<8; aoi++ ){
       hr = 0.1 + 1.5*float(aoi*aoi)/64.;
       aopos = pos + nor * hr;
       //dd = map( aopos).x;
	   totao += max( 0.0, hr-0.01);
    }
    return clamp( 1.0 - 0.15*totao, 0.0, 1.0 );
}

void main() {
    vec4 noise = texture2D(texNoise, vUv/0.02);
    vec4 normal = texture2D(texNormal, vUv/0.0333);
    vec3 lig = normalize(vec3(3.55,12.7,1.4));
    vec3 col = vec3(0.18,0.33,0.45) + vPosition.z*6.5;
    float sun = 0.2;//clamp( dot(vPosition,lig), 0.0, 1.0 );
    col += vec3(2.0,1.5,0.0) *pow( sun, 32.0 );

    vec3 bgcol = col;

    vec3 nor = 2.0*normal.rgb -1.0;
    vec3 pos = vPosition;
    float occ = calcOcc(pos,nor) * clamp(0.7 + 0.3*nor.y,0.0,1.0);
    //float occ = .5;
    // materials
    vec3 mate = vec3(1.0);
    // lighting
    float sky = 0.6 + 0.4*nor.y;
    vec3 sky_color = vec3(0.2,0.3,0.7);

    float dif = clamp(dot(nor,lig),0.0, 1.0);
    float sha = 0.4;


    // lights
    vec3 lin = dif*vec3(1.0);
    lin += 1.2*vec3(0.15,0.20,0.20)*(0.5+0.5*occ);
    lin += occ*( vec3(1.00,1.25,1.30)*0.5*(0.5+0.5*dif*sha)
              +sky_color); //sky*vec3(0.05,0.20,0.45));

    // fog
    col = mix( bgcol, mate*lin, exp(-0.0015) );

    // sun glow
    col += vec3(1.0,0.6,0.2)*0.4*pow( abs(sun), 4.0 );


    gl_FragColor = clamp(vec4( col, 1.0 ),0.,1.);
    // if (vPosition.z < 12.0)
    // {
    //    gl_FragColor = vec4(0.2,0.2,0.8,1.0);
    // }

    //vec4 color_0 = textureCube(skyBox, v_reflected) *0.2;
    //gl_FragColor = clamp(gl_FragColor+color_0, 0.0, 1.0);
}`;
