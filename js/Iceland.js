// return terrain mesh
function CreateTerrain(width, height, cubeMap)
{
  var hmapTexture = new THREE.TextureLoader().load('../pic/heightmapper_1.png');
  var noiseTexture = new THREE.TextureLoader().load('../pic/noise.png');
  var normalTexture = new THREE.TextureLoader().load('../pic/SnowC_N.jpg');
  // var cubeMap = new THREE.CubeTextureLoader()
  //   .setPath("./pic/ame_cotton/")
  //   .load( [
  //     'posx.png',
  //     'negx.png',
  //     'posy.png',
  //     'negy.png',
  //     'posz.png',
  //     'negz.png'
  //   ] );
  normalTexture.wrapS = THREE.RepeatWrapping;
  normalTexture.wrapT = THREE.RepeatWrapping;
  normalTexture.repeat.set( 5, 5 );

  var uniforms = {
    displaceAmt: {type: 'f', value: 2.0},
    displaceOffset: {type: 'f', value: 2.1},
    texHmap: {type: 't', value: hmapTexture},
    texNoise: {type: 't', value: noiseTexture},
    texNormal: {type: 't', value: normalTexture},
    skyBox: { type: "t", value: cubeMap } ,
    time: {type: 'f', value: 0.0}
  };
  var material = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader_hmap, //vertexShader
    fragmentShader: fragShader_hmap //fragmentShader
  });

  var geometry = new THREE.PlaneGeometry(width, height, width, height);
  var terrain = new THREE.Mesh(geometry, material);
  terrain.material.side = THREE.DoubleSide;
  return terrain;
}
