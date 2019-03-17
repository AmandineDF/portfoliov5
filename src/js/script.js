var initRandomize = function() {
  document.querySelectorAll(".randomized").forEach(function(element) {
    element.style.opacity = 0;
  });
};

//RANDOMIZE TEXT
var randomize = function(selector) {
  var element = document.querySelector(selector);
  var text = element.innerHTML;

  element.style.opacity = 1;

  var randomLetters = "丶丿乙人玉力厶土夂女寸小尸父火工己广弋彳心曰";
  var currentIndex = 0;

  function updateRandomize() {
    var displayText = "";
    for (let i = 0; i < text.length; i++) {
      if (i == currentIndex && text.charAt(i) != " ") {
        var randomIndex = Math.floor(randomLetters.length * Math.random());
        displayText += randomLetters.charAt(randomIndex);
      } else if (i < currentIndex) {
        displayText += text.charAt(i);
      }
    }
    element.innerHTML = displayText;

    if (currentIndex < text.length) {
      currentIndex++;
      setTimeout(updateRandomize, 60);
    } else {
      currentIndex = 0;
    }
  }

  updateRandomize();
};

window.onload = function() {
  TweenMax.set(window, {
    scrollTo: 0
  });

  initRandomize();

  randomize("#name");

  //--------------- CANVAS 2D ---------------//

  let canvas2D = document.querySelector("#canvas2D");
  let ctx = canvas2D.getContext("2d");
  canvas2D.height = window.innerHeight;
  canvas2D.width = window.innerWidth;

  window.onresize = function() {
    canvas2D.height = window.innerHeight;
    canvas2D.width = window.innerWidth;
  };

  var waveCounter = 0;
  var deltaTime = 0;
  var lastTime = Date.now();

  var update = function() {
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //Animation
    waveCounter += 0.08 * Math.PI * 2 * deltaTime; //percent(animation speed) * one sin * per second

    //Draw
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight);

    var ratio = window.innerWidth / 1920;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 350 * ratio;

    var precision = 15;
    var amplitude = 100 * ratio;

    for (let i = 0; i <= precision; i++) {
      let sin = Math.sin(waveCounter + (i / precision) * Math.PI * 2);
      let x = (window.innerWidth / precision) * i + sin * amplitude;
      let y =
        (window.innerHeight / precision) * (precision - i) + sin * amplitude;

      ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.globalAlpha = 0.2; //Note : globalAlpha is for all of the canvas
    ctx.filter = "blur(40px)";

    requestAnimationFrame(update);
  };

  update();

  //CONTROLLED SCROLL
  let scrollIndex = 0;
  let canwheel = true;

  window.onwheel = function(e) {
    e.preventDefault();

    if (canwheel) {

      canwheel = false;

      if (e.deltaY > 0 && scrollIndex < 4) {
        scrollIndex++;
      } else if (e.deltaY < 0 && scrollIndex > 0) {
        scrollIndex--;
      } else {
        canwheel = true;
        return;
      }

      setTimeout(() => {
        canwheel = true;
      }, 2000);

      TweenMax.set(window, {
        scrollTo: scrollIndex * window.innerHeight,
        callback: function() {
          if (scrollIndex == 1) {
            document.getElementById("projects").classList.add("is-reached");
          } else {
            document.getElementById("projects").classList.remove("is-reached");
          }
        }
      });
    }
  };

  //MOUSEMOVE PARALLAX
  class Parallax {
    constructor(intensity, smoothing) {
      this.intensity = intensity;
      this.smoothing = smoothing;

      this.mouse = { x: -1, y: -1 };
      this.mouseDelta = { x: 0, y: 0 };

      this.currentDelta = { x: 0, y: 0 };

      this.queryElements(); //targeted elements

      window.addEventListener("mousemove", event => {
        this.mouse = { x: event.clientX, y: event.clientY };
        let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mouseDelta = {
          x: event.clientX - origin.x,
          y: event.clientY - origin.y
        };
      });

      this.update();
    }

    getMovement() {
      return {
        x: -this.currentDelta.x * this.intensity,
        y: -this.currentDelta.y * this.intensity
      };
    }

    queryElements() {
      this.elements = document.querySelectorAll("[data-depth]");
    }

    update() {
      this.currentDelta.x +=
        (this.mouseDelta.x - this.currentDelta.x) * this.smoothing;
      this.currentDelta.y +=
        (this.mouseDelta.y - this.currentDelta.y) * this.smoothing;
      let p = this.getMovement();
      this.elements.forEach(element => {
        let depth = element.getAttribute("data-depth");
        let target = { x: p.x * depth, y: p.y * depth };
        TweenMax.set(element, {
          x: target.x + "px",
          y: target.y + "px",
          force3D: true
        });
      });
      requestAnimationFrame(() => {
        this.update();
      });
    }
  }

  let parallax = new Parallax(0.3, 0.05);

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
  camera.position.z = 50;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.classList.add("canvas3D");
  document.body.appendChild(renderer.domElement);

  //LIGHTS
  var ambientLight = new THREE.AmbientLight(0x19171a);
  //scene.add(ambientLight);

  var light = new THREE.PointLight(0xffe0e0, 3, 100);
  light.position.set(0, 15, 2);
  scene.add(light);

  //FOG
  /*fogColor = new THREE.Color(0x19171A);
  scene.fog = new THREE.Fog( fogColor, 1, 30 );*/

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
  scene.add(planet);

  //GLOW
  var glowGeometry = new THREE.PlaneGeometry(7.4, 7.4, 32);
  var glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: glowTexture
  });
  glowMaterial.transparent = true;

  var glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.set(0, 0.8, 0);
  scene.add(glow);

  //GRID
  /*var horizontalGrid = new THREE.GridHelper(100, 20);
  horizontalGrid.position.set(0, -4, 0);
  scene.add(horizontalGrid);*/

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

  TweenMax.to(camera.position, 2, {
    z: 10,
    delay: 1,
    ease: Power4.easeOut
  });
};
