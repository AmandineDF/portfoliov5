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
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

window.onload = function() {

  initRandomize();
  initFromBottom();

  let parallax = new Parallax(0.3, 0.05);
  let sinwave = new SinWave("#canvas2D");
  //let planetScene = new PlanetScene("#canvas3D");
  //let cursor = {x: 0, y: 0};

  var update = function(){

    sinwave.update();
    parallax.update();
    //planetScene.render();

    /*cursor.x += (parallax.mouse.x - cursor.x) * 0.3;
    cursor.y += (parallax.mouse.y - cursor.y) * 0.3;
    
    TweenMax.set('#cursor',{x: cursor.x - 15, y: cursor.y - 15, force3D:true });*/

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

      TweenMax.to(selector, 0.4, {
        opacity: 0
      })
      
      setTimeout(() => {
        canScroll = true;
      }, 2000);

      TweenMax.to("section:nth-child(" + (currentIndex + 1) + ")", 0.2, {
        opacity: 1,
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

    if(Math.sign(e.deltaY) == 1) {
      document.getElementById('downBtn').classList.add('triggered');
      setTimeout(() => {
        document.getElementById('downBtn').classList.remove('triggered');
      }, 500);
    } else {
      document.getElementById('upBtn').classList.add('triggered');
      setTimeout(() => {
        document.getElementById('upBtn').classList.remove('triggered');
      }, 500);
    }
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

  var light = new THREE.PointLight(0xffe0e0, 4, 100);
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
  planet.position.z = -60;
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
  glow.position.z = -60;
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
    }, 4000);

  }, 500);

  var crossIcon = document.getElementById('crossIcon');

  var uryoMini = document.querySelector('#uryo');
  var uryoProject = document.querySelector('.uryo');
  uryoMini.addEventListener("click", function(){
    uryoProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var easyjetMini = document.querySelector('#easyjet');
  var easyjetProject = document.querySelector('.easyjet');
  easyjetMini.addEventListener("click", function(){
    easyjetProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var nespressoMini = document.querySelector('#nespresso');
  var nespressoProject = document.querySelector('.nespresso');
  nespressoMini.addEventListener("click", function(){
    nespressoProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var o2dieMini = document.querySelector('#o2die');
  var o2dieProject = document.querySelector('.o2die');
  o2dieMini.addEventListener("click", function(){
    o2dieProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var butellaMini = document.querySelector('#butellaForest');
  var butellaProject = document.querySelector('.butellaForest');
  butellaMini.addEventListener("click", function(){
    butellaProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var sphinxMini = document.querySelector('#theSphinx');
  var sphinxProject = document.querySelector('.theSphinx');
  sphinxMini.addEventListener("click", function(){
    sphinxProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  var insideMini = document.querySelector('#insideOfUs');
  var insideProject = document.querySelector('.insideOfUs');
  insideMini.addEventListener("click", function(){
    insideProject.classList.add('clicked');
    crossIcon.classList.add('active');
    canScroll = false;
  });

  crossIcon.addEventListener('click', function(){
    var projectList = document.querySelectorAll(".opened__project");
    projectList.forEach(function(element){
      element.classList.remove('clicked');
    });
    this.classList.remove('active');
    canScroll = true;
  });

  var styles = [
    'background: lightslategrey'
    , 'color: white'
    , 'display: block'
    , 'padding: 1rem 0.5rem'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 1.5rem'
  ].join(';');

  console.log('%c Hello Curious John', styles);
};
