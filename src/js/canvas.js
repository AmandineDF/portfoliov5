window.onload = function () {

    // LIBRARIES
    var THREE = require('three');

    // IMAGES
    var planetImage = require('../images/texture/sky.png');
    var skyImage = require('../images/texture/sky.png');
    var satelliteImage = require('../images/texture/planet2.jpg');
    var floorImage = require('../images/texture/grid.svg');

    //--------//

    // SCENE
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.z = 10;

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight, /*updateStyle*/ );
    document.body.appendChild( renderer.domElement ); //create a <canvas> element

    let canvas = document.querySelector('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    window.onresize = function(){
       canvas.height = window.innerHeight;
       canvas.width = window.innerWidth;
    }

    //LIGHTS

    var light = new THREE.PointLight( 0xffffff, 2, 100 );
    light.position.set( 0, 15, 25 );
    scene.add( light );

    /*var light2 = new THREE.PointLight( 0xffe7a8, 0.1, 100 );
    light2.position.set( 0, -20, -20 );
    scene.add( light2 );
    */

    var ambientLight = new THREE.AmbientLight( 0x909090 );
    scene.add( ambientLight );

    //SKYBOX

    var skyGeometry = new THREE.SphereGeometry(90, 50, 50);

    var skyTexture = new THREE.TextureLoader().load(skyImage);
    var skyMaterial = new THREE.MeshPhongMaterial({
        map: skyTexture,
        //color: 0x000000,
        side: THREE.DoubleSide,
        shininess: 0
    })

    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);

    // PLANE

    /*var floorGeometry = new THREE.PlaneGeometry( 12, 5, 20);

    var floorTexture = new THREE.TextureLoader().load(floorImage);
    var floorMaterial = new THREE.MeshBasicMaterial({
        map: floorTexture,
        side: THREE.DoubleSide
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.position.y = -4;
    //floor.rotation.x = Math.PI / 1.8;
    scene.add( floor );*/


    //SATELLITE

    var satelliteGeometry = new THREE.SphereGeometry(0.3, 50, 50);

    var satelliteTexture = new THREE.TextureLoader().load(satelliteImage);
    var satelliteMaterial = new THREE.MeshStandardMaterial({
        map: satelliteTexture,
        color: 0xaaaaaa,
        roughness : 0.7,
        metalness : 0.4
    });

    var satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.set(6, 0, 0);
    scene.add(satellite);

    //BIG PLANET

    var planetGeometry = new THREE.SphereGeometry( 2.8, 50, 50 ); //object that contains all the points (vertices) and faces

    var planetTexture = new THREE.TextureLoader().load(planetImage);
    var planetMaterial = new THREE.MeshStandardMaterial({
        map : planetTexture,
        color: 0xaaaaaa,
        roughness : 0.7,
        metalness : 0.4
    });

    var planet = new THREE.Mesh( planetGeometry, planetMaterial );
    planet.rotation.z += 90;
    scene.add( planet );

    // GRID
    var horizontalGrid = new THREE.GridHelper( 120, 35 );
    horizontalGrid.position.set(0, -4, 0);
    scene.add(horizontalGrid);

    var verticalGrid = new THREE.GridHelper( 60, 20);
    verticalGrid.position.set(0, 28.8, -9.8);
    verticalGrid.rotation.x = Math.PI / 2;
    scene.add(verticalGrid);

    //RENDERING THE SCENE : CREATING AN ANIMATION LOOP EVERY TIME THE SCREEN IS REFRESHED (60fps)

    var clock = new THREE.Clock();
    var r = 5;
    var counter = 0;
    var incrementation = 2 * Math.PI / 1000; //TODO : convert in degrees

    var render = function () {
        var delta = clock.getDelta(); //get time between each frames (always stored in var)

        //planet rotation animation
        planet.rotation.x -= Math.PI / 180*10 * delta; //convert radiant (initial) to degrees -> 10° per second

        //satellite rotation animation
        //satellite.rotation.y -= Math.PI / 180*10 * delta;

        //orbit animation
        counter += incrementation;
        satellite.position.x = r * Math.cos(counter);
        satellite.position.z = r * Math.sin(counter);

        renderer.render( scene, camera );
        requestAnimationFrame( render ); //60fps
    };

    render();

}