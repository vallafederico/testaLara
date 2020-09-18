
(function () {
  let scene,
  renderer,
  camera,
  model,
  raycaster = new THREE.Raycaster(),
  loaderAnim = document.getElementById('js-loader');

  init();
  function init() {

    const MODEL_PATH = 'https://cdn.jsdelivr.net/gh/vallafederico/testaLara@master/laraF1.gltf';
    const canvas = document.querySelector('#c');
    const backgroundColor = 0xf1f1f1;

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    // RENDERE
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // CAMERA
    camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
    // ORBIT CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = -3;
    controls.update();

    let lara_txt = new THREE.TextureLoader().load('laratexture_2.jpg');
    lara_txt.flipY = false;

    const lara_mtl = new THREE.MeshPhongMaterial({
      map: lara_txt,
      color: 0xffffff,
      skinning: true });

    // LARALOADER
    var loader = new THREE.GLTFLoader();
    loader.load(
    MODEL_PATH,
    function (gltf) {
      model = gltf.scene;
      let fileAnimations = gltf.animations;

      model.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          o.material = lara_mtl;
        }

      });

      // POSITION LARA
      model.scale.set(10, 10, 10);
      model.position.y = -11;
      scene.add(model);

    },
    undefined, // return in case of false promise // maybe REMOVE?
    function (error) {
      console.error(error);
    });


    // LIGHTS ALL
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // hemiLIGHT
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // dirLIGHT
    scene.add(dirLight);

    // FLOOR
    /*let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0 });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);
    */
  }


  // update function (?)
  function update() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(update);
    	controls.update();

  }

  update();

  // resize canvas control
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
    canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // get mouse position in object
  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

})();
