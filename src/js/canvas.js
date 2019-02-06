window.onload = function() {
  //---- SCRIPT ----//

  // LOADING STYLE
  var loader = document.getElementById("loader");
  setTimeout(function() {
    loader.style.opacity = 0;
  }, 1000);

  // TRANSITION
  var enterButton = document.getElementById("enterButton");
  enterButton.addEventListener("click", function(e) {
    e.preventDefault();

    loader.style.opacity = 1;

    setTimeout(function() {
      var destination = enterButton.getAttribute("href");
      window.location = destination;
    }, 500);
  });

  //---- WEBGL ----//

  // LIBRARIES
  var THREE = require("three");

  // IMAGES & TEXTURES
  var skyImage = require("../images/texture/sky.png");
  var satelliteImage = require("../images/texture/planet.jpg");

  var skyTexture = new THREE.TextureLoader().load(skyImage);
  var satelliteTexture = new THREE.TextureLoader().load(satelliteImage);

  // SCENE
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight /*updateStyle*/);
  document.body.appendChild(renderer.domElement); //create a <canvas> element

  let canvas = document.querySelector("canvas");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  window.onresize = function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  };

  //LIGHTS

  var light = new THREE.PointLight(0xffffff, 3, 100);
  light.position.set(0, 15, 25);
  scene.add(light);

  /*var light2 = new THREE.PointLight( 0xffe7a8, 0.1, 100 );
    light2.position.set( 0, -20, -20 );
    scene.add( light2 );*/

  var ambientLight = new THREE.AmbientLight(0xdedede);
  scene.add(ambientLight);

  // PLANE

  var geometry = new THREE.PlaneGeometry( 125, 60, 32 );

  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: skyTexture,
    side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh( geometry, material );
  plane.position.set(0, 0, -60);
  scene.add( plane );

  //SATELLITE

  var satelliteGeometry = new THREE.SphereGeometry(0.3, 50, 50);

  var satelliteMaterial = new THREE.MeshStandardMaterial({
    map: satelliteTexture,
    color: 0xaaaaaa,
    roughness: 0.7,
    metalness: 0.4
  });

  var satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
  satellite.position.set(6, 0, 0);
  scene.add(satellite);

  //BIG PLANET

  var planetGeometry = new THREE.SphereGeometry(2.8, 50, 50); //object that contains all the points (vertices) and faces

  var planetMaterial = new THREE.MeshStandardMaterial({
    map: skyTexture,
    color: 0xaaaaaa,
    roughness: 0.7,
    metalness: 0.4
  });

  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.rotation.z += 90;
  scene.add(planet);

  // GRID
  var horizontalGrid = new THREE.GridHelper(100, 20);
  horizontalGrid.position.set(0, -4, 0);
  scene.add(horizontalGrid);

  var verticalGrid = new THREE.GridHelper(91, 20);
  //verticalGrid.position.set(0, 28.8, -9.8);
  verticalGrid.position.set(0, 42, -43);
  verticalGrid.rotation.x = Math.PI / 2;
  scene.add(verticalGrid);

  //MOUSE MOVE

  var mouse = { x: 0, y: 0 };
  var cameraMoves = { x: 0, y: 0, z: -0.1, move: false, speed: 0.2 };

  function mouseMove(e) {
    camera.position.x += Math.max(
      Math.min((e.clientX - mouse.x) * 0.0004, cameraMoves.speed),
      -cameraMoves.speed
    );
    camera.position.y += Math.max(
      Math.min((mouse.y - e.clientY) * 0.0004, cameraMoves.speed),
      -cameraMoves.speed
    );

    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  window.addEventListener("mousemove", mouseMove);

  //RENDERING THE SCENE : CREATING AN ANIMATION LOOP EVERY TIME THE SCREEN IS REFRESHED (60fps)

  var clock = new THREE.Clock();
  var r = 5;
  var counter = 0;
  var incrementation = (2 * Math.PI) / 1000; //TODO : convert in degrees

  var render = function() {
    var delta = clock.getDelta(); //get time between each frames (always stored in var)

    //planet rotation animation
    planet.rotation.x -= (Math.PI / 180) * 10 * delta; //convert radiant (initial) to degrees -> 10° per second

    //satellite rotation animation
    //satellite.rotation.y -= Math.PI / 180*10 * delta;

    //orbit animation
    counter += incrementation;
    satellite.position.x = r * Math.cos(counter);
    satellite.position.z = r * Math.sin(counter);

    renderer.render(scene, camera);
    requestAnimationFrame(render); //60fps
  };

  render();
};
