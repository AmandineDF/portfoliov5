// SCENE

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight, /*updateStyle*/ );
document.body.appendChild( renderer.domElement ); //create a <canvas> element

//BIG PLANET

var planetGeometry = new THREE.SphereGeometry( 3, 32, 32 ); //object that contains all the points (vertices) and faces

var planetTexture = new THREE.TextureLoader().load('/images/texture/planet.png');
var planetMaterial = new THREE.MeshStandardMaterial({
    map : planetTexture,
    roughness : 0.7,
    metalness : 0.4
});

var planet = new THREE.Mesh( planetGeometry, planetMaterial ); //create the object that can be inserted to the scene, and move freely around
planet.rotation.z += Math.PI / 2;
scene.add( planet );

//LIGHTS

var light = new THREE.PointLight( 0xffffff, 1.7, 100 );
light.position.set( 0, 20, -7 );
scene.add( light );

var light2 = new THREE.PointLight( 0xffe7a8, 0.1, 100 );
light2.position.set( 0, -20, -20 );
scene.add( light2 );

var ambientLight = new THREE.AmbientLight( 0x202020 );
scene.add( ambientLight );

//RENDERING THE SCENE : CREATING AN ANIMATION LOOP EVERY TIME THE SCREEN IS REFRESHED (60fps)

var clock = new THREE.Clock();

var render = function () {
    requestAnimationFrame( render );
    var delta = clock.getDelta(); //get time between each frames (always stored in var)

    //rotation animation
    planet.rotation.x -= Math.PI / 180*10 * delta; //convert radiant (initial) to degrees -> 10° per second
    //planet.rotation.y += 0.01;

    renderer.render( scene, camera );
};

render();
