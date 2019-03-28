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
export {THREE, noiseImage, glowImage, planetTexture, glowTexture} from "./planet";
import PlanetScene from "./planet";

import TweenMax from "gsap/TweenMax";

var uryoGif = require("../images/gif/uryo.min.gif");
var easyjetGif = require("../images/gif/easyjet.min.gif");
var nespressoGif = require("../images/gif/nespresso.min.gif");
var o2dieGif = require("../images/gif/o2die.min.gif");
var butellaGif = require("../images/gif/butellaforest.min.gif");
var taiwanGif = require("../images/gif/taiwan.min.gif");


window._color = "white";

//----------------------------------- WINDOW ONLOAD -----------------------------------------//
//Force to start from the beginning  after reloading
window.onbeforeunload = function() {
  window.scrollTo(0, 0);
};

window.onload = function() {
  document.querySelector('body').style.opacity = 1;
  //Animations init
  initRandomize();
  initFromBottom();

  //Imports
  let parallax = new Parallax(0.3, 0.05);
  let sinwave = new SinWave("#canvas2D");
  let planetScene = new PlanetScene("#canvas3D");

  //Gif Lazy loads
  document.querySelector('#uryo img').setAttribute('src', uryoGif);
  document.querySelector('#easyjet img').setAttribute('src', easyjetGif);
  document.querySelector('#nespresso img').setAttribute('src', nespressoGif);
  document.querySelector('#o2die img').setAttribute('src', o2dieGif);
  document.querySelector('#butellaForest img').setAttribute('src', butellaGif);
  document.querySelector('#taiwan img').setAttribute('src', taiwanGif);

  //Update every objects
  var update = function() {
    sinwave.update();
    sinwave.color = window._color;
    parallax.update();
    planetScene.render();

    requestAnimationFrame(update);
  };

  update();

  //LOADER ANIMATIONS
  let fromBottomElements = document.querySelectorAll(".loader__text .fromBottom");
  for (let i = 1; i <= fromBottomElements.length; i++) {
    setTimeout(function() {
      animateFromBottom(".loader__text p:nth-of-type(" + i + ")");
    }, i * 500);
  }

  setTimeout(function() {
    document.querySelector(".border").style.border = "10px solid lightgrey";
    document.querySelector(".loader__text").style.display = "none";
  }, 3500);

  setTimeout(function() {
    //WEBGL ANIMATIONS
    TweenMax.to(planetScene.planet.position, 2, {
      z: 0,
      ease: Power4.easeOut
    });

    TweenMax.to(planetScene.glow.position, 2, {
      z: 0,
      ease: Power4.easeOut
    });

    TweenMax.to(planetScene.horizontalGrid.position, 2, {
      y: -5,
      delay: 1,
      ease: Power4.easeOut
    });
  }, 3900);

  //FIRST SECTION
  setTimeout(function() {
    animateSection(0);
  }, 5000);

  //CONTROLLED SCROLL
  let currentIndex = 0; //Current index, which is different from "index", the next one
  let canScroll = true; //Fix the "infinite scroll" problem

  var changeIndex = function(index) {
    if (canScroll) {
      canScroll = false;

      var selector = "section:nth-child(" + (currentIndex + 1) + ")";

      if (index <= 4 && index >= 0 && index != currentIndex) { //"4" is because I have 5 sections

        if (currentIndex < index) {
          document.getElementById("downBtn").classList.add("triggered");
          setTimeout(() => {
            document.getElementById("downBtn").classList.remove("triggered");
          }, 500);
        } else {
          document.getElementById("upBtn").classList.add("triggered");
          setTimeout(() => {
            document.getElementById("upBtn").classList.remove("triggered");
          }, 500);
        }

        currentIndex = index;
      } else {
        canScroll = true;
        return;
      }

      TweenMax.to(selector, 0.4, {
        opacity: 0
      });

      setTimeout(() => {
        canScroll = true;
      }, 2000);

      TweenMax.to("section:nth-child(" + (currentIndex + 1) + ")", 0.2, {
        opacity: 1
      });

      TweenMax.to(window, 0.8, { scrollTo: {y: currentIndex * window.innerHeight, autoKill:false}, onComplete: function() {  animateSection(currentIndex);//start the animations of the new section
        }
      });
    }
  };

  //rightNav arrows
  var downBtn = document.getElementById("downBtn");
  downBtn.addEventListener("click", function() {
    changeIndex(currentIndex + 1);
  });

  var upBtn = document.getElementById("upBtn");
  upBtn.addEventListener("click", function() {
    changeIndex(currentIndex - 1);
  });

  window.addEventListener('wheel', function(e){
    //e.preventDefault();
    changeIndex(currentIndex + Math.sign(e.deltaY));
  });

  //leftNav menu
  var leftNav = document.querySelectorAll(".leftNav li");
  for (let i = 0; i < leftNav.length; i++) {
    leftNav[i].addEventListener("click", function() {
      changeIndex(i);
    });
  }   
  
  //When a Back-end dev would be helpful...
  var crossIcon = document.getElementById("crossIcon");

  var uryoMini = document.querySelector("#uryo");
  var uryoProject = document.querySelector(".uryo");
  uryoMini.addEventListener("click", function() {
    uryoProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var easyjetMini = document.querySelector("#easyjet");
  var easyjetProject = document.querySelector(".easyjet");
  easyjetMini.addEventListener("click", function() {
    easyjetProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var nespressoMini = document.querySelector("#nespresso");
  var nespressoProject = document.querySelector(".nespresso");
  nespressoMini.addEventListener("click", function() {
    nespressoProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var o2dieMini = document.querySelector("#o2die");
  var o2dieProject = document.querySelector(".o2die");
  o2dieMini.addEventListener("click", function() {
    o2dieProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var butellaMini = document.querySelector("#butellaForest");
  var butellaProject = document.querySelector(".butellaForest");
  butellaMini.addEventListener("click", function() {
    butellaProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var sphinxMini = document.querySelector("#theSphinx");
  var sphinxProject = document.querySelector(".theSphinx");
  sphinxMini.addEventListener("click", function() {
    sphinxProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  var insideMini = document.querySelector("#insideOfUs");
  var insideProject = document.querySelector(".insideOfUs");
  insideMini.addEventListener("click", function() {
    insideProject.classList.add("clicked");
    crossIcon.classList.add("active");
    canScroll = false;
  });

  crossIcon.addEventListener("click", function() {
    var projectList = document.querySelectorAll(".opened__project");
    projectList.forEach(function(element) {
      element.classList.remove("clicked");
    });
    this.classList.remove("active");
    canScroll = true;
  });

  //Little console Easter Egg
  var mainStyle = [
    "background: darkblue",
    "color: white",
    "display: block",
    "padding: 1rem 0.5rem",
    "text-align: center",
    "font-size: 1.5rem"
  ].join(";");

  var simpleStyle = [
    "background: darkblue",
    "color: white",
    "display: block",
    "padding: 0.5rem",
    "text-align: center",
    "font-size: 1rem"
  ].join(";");

  console.log("%c Hello Curious John/Jane.", mainStyle);
  console.log(`%c What's your favorite color ? Write it in the function below to see some magic...`, mainStyle);
  console.log(`%c example: window._color ="purple"`, simpleStyle);
  
};