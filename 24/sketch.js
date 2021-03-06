//0.95if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera,scene,renderer;
// spheres geomteries
var spheres = [];
var pointLight, pointLight2;

// fly over control
var controls;
var clock = new THREE.Clock();

init();
animatedRender();

function init() {
    var viewAngle = 75;
    var aspectRatio = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 1000;
    camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);

    camera.position.z = 100;
    // controls
    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 50;
    controls.domElement = container;
    controls.rollSpeed = 0.04;
    controls.autoForward = false;
    controls.dragToLook = false;

    pointLight = new THREE.PointLight( 0xffaa40);
    pointLight.add( new THREE.Mesh( new THREE.SphereGeometry( 30, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xffaa40, wireframe: true} ) ) );
    pointLight.position.x = 300;

    pointLight2 = new THREE.PointLight( 0xffaa40);
    pointLight2.add( new THREE.Mesh( new THREE.SphereGeometry( 30, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xffaa40, wireframe: true} ) ) );
    pointLight2.position.x = -300;

    var skyColor = new THREE.Color(0.95, 0.95, 0.95);
    renderer.setClearColor(skyColor, 1.0);

    createSphere();

    scene.add(camera, pointLight, pointLight2);
}


function animatedRender() {

  var time = new Date();

  requestAnimationFrame(animatedRender);

  // fly over control
  var delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);

  // Spherical and Geographic Coordinates control
  for (var i = 0; i < spheres.length; i++) {
    // rotate sphere
    spheres[i].sphere.rotation.x += 0.01;
    spheres[i].sphere.rotation.y += 0.01;
    spheres[i].sphere.rotation.z += 0.01;
    // spheres[i].sphere.rotation.y += Math.PI;

    // set the vertices so that they update
    spheres[i].sphere.geometry.verticesNeedUpdate = true;
    var vertices = spheres[i].sphere.geometry.vertices;
    var initCords = spheres[i].sphere.initCords;

    for (var j = 0; j < vertices.length; j++) {

      // trigonmetry stuff
      var radius = Math.sqrt(Math.pow(initCords[j].x, 2) + Math.pow(initCords[j].y, 2) + Math.pow(initCords[j].z, 2));
      var polar = Math.acos(initCords[j].z/radius);
      var azimuthal = Math.atan2(initCords[j].y, initCords[j].x);

      // variable
      var radiusVar = Math.sin(polar*5) * Math.cos(time/2000) * 5;

      vertices[j].x = (radius - radiusVar) * Math.sin(polar) * Math.cos(azimuthal);
      vertices[j].y = (radius + radiusVar) * Math.sin(polar) * Math.sin(azimuthal);
      vertices[j].z = (radius - radiusVar) * Math.cos(polar);
    }
  }
}

function createSphere() {
  var radius = 10;
  var segments = 100;
  var rings = 100;
  var geometry = new THREE.SphereGeometry(radius, segments, rings);

  var material = new THREE.MeshStandardMaterial({
    shading: THREE.FlatShading,
    roughness: 0.7,
    metalness: 1.0,
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
    wireframe: false,
    wireframeLinewidth: 3,
    opacity : 1,
    transparent: true
  });

  var sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  var verticesArray = [];
  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    // keep track of the initial generated coordinates
    var initCords = {
      x : sphere.geometry.vertices[i].x,
      y : sphere.geometry.vertices[i].y,
      z : sphere.geometry.vertices[i].z,
    };
    verticesArray.push(initCords);
  }

  sphere.initCords = verticesArray;

  // add to array of shperes
  spheres.push({
    sphere
  });
  console.log(spheres[0].sphere.geometry.vertices[673]);
  console.log(spheres[0].sphere.initCords[673]);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
