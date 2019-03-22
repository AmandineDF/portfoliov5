//----------------------------------- IMPORTS -----------------------------------------//

import Parallax from "./parallax";
import SinWave from "./sinwave";
import {
  initFromBottom,
  initRandomize,
  animateFromBottom,
  randomize,
  animateSection
} from "./animations";
//export {THREE, noiseImage, glowImage, planetTexture, glowTexture} from "./planet";
//import PlanetScene from "./planet";

//----------------------------------- WINDOW ONLOAD -----------------------------------------//

window.onload = function() {
  TweenMax.set(window, {
    scrollTo: 0
  });

  initRandomize();
  initFromBottom();

  let parallax = new Parallax(0.3, 0.05);
  let sinwave = new SinWave("#canvas2D");
  //let planetScene = new PlanetScene("#canvas3D");

  var update = function(){

    sinwave.update();
    parallax.update();
    //planetScene.render();

    requestAnimationFrame(update);
  }

  update();

  //CONTROLLED SCROLL

  let currentIndex = 0;
  let canScroll = true;

  var changeIndex = function(index) {
    if (canScroll) {
      canScroll = false;

      var selector = "section:nth-child(" + (currentIndex + 1) + ")";

      if (index <= 4 && index >= 0 && index != currentIndex) {
        currentIndex = index;
      } else {
        canScroll = true;
        return;
      }

      console.log(index);

      TweenMax.to(selector, 0.4, {
        opacity: 0
      });

      setTimeout(() => {
        canScroll = true;
      }, 2000);

      TweenMax.set("section:nth-child(" + (currentIndex + 1) + ")", {
        opacity: 1
      });

      TweenMax.to(window, 0.8, {
        scrollTo: currentIndex * window.innerHeight,
        onComplete: function() {
          animateSection(currentIndex);
        }
      });
    }
  };

  var downBtn = document.getElementById('downBtn');
  downBtn.addEventListener('click', function(){
    changeIndex(currentIndex + 1);
  });

  var upBtn = document.getElementById('upBtn');
  upBtn.addEventListener('click', function(){
    changeIndex(currentIndex - 1);
  });

  window.onwheel = function(e) {
    e.preventDefault();
    changeIndex(currentIndex + Math.sign(e.deltaY));
  };

  var leftNav = document.querySelectorAll('.leftNav li');
  for(let i = 0; i < leftNav.length; i++){
    leftNav[i].addEventListener('click', function(){
      changeIndex(i);
    });
  }

  //--------------- WEBGL ---------------//

  // LIBRARIES
  var THREE = require("three");

  //IMAGES & TEXTURES
  var noiseImage = require("../images/texture/noise-large.png");
  var glowImage = require("../images/texture/glow-small.png");

  var planetTexture = new THREE.TextureLoader().load(noiseImage);
  var glowTexture = new THREE.TextureLoader().load(glowImage);

  //SCENE
  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 10;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.classList.add("canvas3D");
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  //LIGHTS
  var ambientLight = new THREE.AmbientLight(0x19171a);
  //scene.add(ambientLight);

  var light = new THREE.PointLight(0xffe0e0, 3, 100);
  light.position.set(0, 15, 2);
  scene.add(light);

  //BIG PLANET
  var planetGeometry = new THREE.SphereGeometry(2.8, 50, 50);
  var planetColor = new THREE.Color("skyblue");

  var planetMaterial = new THREE.MeshStandardMaterial({
    color: planetColor,
    map: planetTexture,
    roughness: 0.7,
    metalness: 0.4
  });

  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.rotation.z += 90;
  planet.position.z = -20;
  scene.add(planet);

  //GLOW
  var glowGeometry = new THREE.PlaneGeometry(7.4, 7.4, 32);
  var glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: glowTexture
  });
  glowMaterial.transparent = true;

  var glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = 0.8;
  glow.position.z = -20;
  scene.add(glow);

  //GRID
  var horizontalGrid = new THREE.GridHelper(100, 20);
  horizontalGrid.position.y = -25;
  scene.add(horizontalGrid);

  //RENDER
  var clock = new THREE.Clock();

  var render = function() {
    var delta = clock.getDelta();

    planet.rotation.x -= (Math.PI / 180) * 10 * delta;

    glow.rotation.z += (Math.PI / 180) * 80 * delta;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();

  setTimeout(function() {
    let fromBottomElements = document.querySelectorAll('.loader__text .fromBottom');
    for(let i = 1; i <= fromBottomElements.length; i++){
      setTimeout(function() {
        animateFromBottom(".loader__text p:nth-of-type(" + i + ")");
      }, i * 500);
    }

    setTimeout(function() {
      document.querySelector(".border").style.border = "10px solid lightgrey";
      document.querySelector('.loader__text').style.display = "none";
  
      setTimeout(function() {
        //WEBGL ANIMATIONS
        TweenMax.to(planet.position, 2, {
          z: 0,
          ease: Power4.easeOut
        });
  
        TweenMax.to(glow.position, 2, {
          z: 0,
          ease: Power4.easeOut
        });
  
        TweenMax.to(horizontalGrid.position, 2, {
          y: -5,
          delay: 1,
          ease: Power4.easeOut
        });
  
        //FIRST SECTION
        setTimeout(function() {
          animateSection(0);
        }, 1000);
      }, 400);
    }, 3000);

  }, 0);

  var projectList = document.querySelectorAll("#project");
  var openedProject = document.querySelector('.opened__project');
  for (let i = 0; i < projectList.length; i++) {
    var project = projectList[i];

    project.addEventListener("click", function() {
      openedProject.classList.add('clicked');
      canScroll = false;
    });
  }

  var crossIcon = document.getElementById('crossIcon');
  crossIcon.addEventListener('click', function() {
    openedProject.classList.remove('clicked');
    canScroll = true;
  });
};
