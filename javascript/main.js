//defining main elements
let scene,
  camera,
  renderer,
  cloudParticles = [];

//main function
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  //setting up camera
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  //setting main ambient light
  let ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  //setting the directional light
  let directionalLight = new THREE.DirectionalLight(0x1db954);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  //three point lights for effect
  let greenLight = new THREE.PointLight(0x1db954, 50, 450, 1.7);
  greenLight.position.set(200, 300, 100);
  scene.add(greenLight);
  let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
  redLight.position.set(100, 300, 100);
  scene.add(redLight);
  let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
  blueLight.position.set(300, 300, 200);
  scene.add(blueLight);

  //setting renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //adding fog to the scene
  scene.fog = new THREE.FogExp2(0x191414, 0.001);
  renderer.setClearColor(scene.fog.color);

  //loading texture
  let loader = new THREE.TextureLoader();
  loader.load("../images/smoke-1.png", function (texture) {
    //loading cloud plane and making it transparent
    cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });
    //looping cloud planes multiple times
    for (let p = 0; p < 50; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(
        Math.random() * 800 - 400,
        500,
        Math.random() * 500 - 500
      );
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.55;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  loader.load("../images/album.jpg", function (texture) {
    //loading cloud plane and making it transparent
    cloudGeo = new THREE.PlaneBufferGeometry(400, 400);
    cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
    });
  });

  loader.load("../images/stars.jpg", function (texture) {
    const textureEffect = new POSTPROCESSING.TextureEffect({
      blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
      texture: texture,
    });
    textureEffect.blendMode.opacity.value = 0.2;

    const bloomEffect = new POSTPROCESSING.BloomEffect({
      blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
      kernelSize: POSTPROCESSING.KernelSize.SMALL,
      useLuminanceFilter: true,
      luminanceThreshold: 0.3,
      luminanceSmoothing: 0.75,
    });
    bloomEffect.blendMode.opacity.value = 1.5;

    let effectPass = new POSTPROCESSING.EffectPass(
      camera,
      bloomEffect,
      textureEffect
    );
    effectPass.renderToScreen = true;

    composer = new POSTPROCESSING.EffectComposer(renderer);
    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
    composer.addPass(effectPass);

    window.addEventListener("resize", onWindowResize, false);
    render();
  });
}

//resize function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//render function to render per frame
function render() {
  composer.render(0.1);
  requestAnimationFrame(render);
  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.001;
  });
}
init();