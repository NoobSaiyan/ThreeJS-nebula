//defining main elements
let scene, camera, renderer, controls;

const cloudParticles = [];

//main function
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    6000
  );
  // var gridHelper = new THREE.GridHelper(500, 500);
  // scene.add(gridHelper);

  //setting up camera
  camera.position.z = 250;

  // var helper = new THREE.CameraHelper(camera);
  // scene.add(helper);

  //setting renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //adding fog to the scene
  scene.fog = new THREE.FogExp2(0x191414, 0.0015);
  renderer.setClearColor(scene.fog.color);

  //controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  //setting main ambient light
  let ambient = new THREE.AmbientLight(0x555555, 0.2);
  scene.add(ambient);

  //setting the directional light
  let directionalLight = new THREE.DirectionalLight(0xff1100, 1.2);
  directionalLight.position.set(0, 0, 200);
  scene.add(directionalLight);
  // var helper = new THREE.DirectionalLightHelper(directionalLight, 2);
  // scene.add(helper);
  let directionalLight2 = new THREE.DirectionalLight(0xff002f, 3);
  directionalLight2.position.set(0, 0, -200);
  directionalLight2.rotation.x = 1;
  scene.add(directionalLight2);
  // var helper = new THREE.DirectionalLightHelper(directionalLight2, 5);
  // scene.add(helper);

  //three point lights for effect
  let darkRedLight = new THREE.PointLight(0xd40027, 80, 450, 0.7);
  darkRedLight.position.set(-200, 0, -40);
  scene.add(darkRedLight);
  // var sphereSize = 10;
  // var pointLightHelper = new THREE.PointLightHelper(darkRedLight, sphereSize);
  // scene.add(pointLightHelper);
  //
  let redLight = new THREE.PointLight(0xd8547e, 80, 450, 0.7);
  redLight.position.set(100, 0, -40);
  scene.add(redLight);
  // var pointLightHelper = new THREE.PointLightHelper(redLight, sphereSize);
  // scene.add(pointLightHelper);
  //
  let lightRedLight = new THREE.PointLight(0xff0048, 80, 450, 0.7);
  lightRedLight.position.set(300, 0, -50);
  scene.add(lightRedLight);
  // var pointLightHelper = new THREE.PointLightHelper(lightRedLight, sphereSize);
  // scene.add(pointLightHelper);

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
        0,
        Math.random() * 500 - 500
      );
      // cloud.rotation.x = 1.16;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.55;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  //main text
  var Fontloader = new THREE.FontLoader();
  Fontloader.load("../fonts/helvetiker_regular.typeface.json", function (font) {
    var textGeometry = new THREE.TextGeometry("NoobSaiyan", {
      font: font,
      size: 20,
      height: 3,
      curveSegments: 7,
    });
    var textMaterial = new THREE.MeshStandardMaterial({
      color: 0xbbeced,
    });

    var text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.x = -260;
    text.position.y = 100;
    text.position.z = -5;
    text.rotation.y = 0;

    scene.add(text);
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
      luminanceThreshold: 0,
      luminanceSmoothing: 0,
    });
    bloomEffect.blendMode.opacity.value = 0.1;

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
  requestAnimationFrame(render);
  // controls.update();
  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.001;
  });
  composer.render(0.1);
}
init();
