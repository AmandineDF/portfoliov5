//--------------- INITIALIZATION ---------------//

//INIT FROMBOTTOM
var initFromBottom = function() {
  var elements = document.querySelectorAll(".fromBottom");

  elements.forEach(function(element) {
    var text = element.innerHTML;
    var string = "";

    for (let i = 0; i < text.length; i++) {
      string += "<span>" + text.charAt(i) + "</span>";
    }
    element.innerHTML = string;
  });
};

//INIT RANDOMIZE
var initRandomize = function() {
  document.querySelectorAll(".randomized").forEach(function(element) {
    element.style.opacity = 0;
  });
};

//--------------- ANIMATIONS & EFFECTS ---------------//

//FROMBOTTOM ANIMATION
var animateFromBottom = function(selector, delay) {
  var letters = document.querySelectorAll(selector + " span");
  setTimeout(function() {
    for (let i = 0; i < letters.length; i++) {
      setTimeout(function() {
        letters[i].classList.add("appeared");
      }, i * 10);
    }
  }, delay);
};

//RANDOMIZE ANIMATION
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

//--------------- ANIMATE WITH INDEX ---------------//

//ANIMATIONS TIMELINE
var animateSection = function(index) {

  //INITIALIZE
  initRandomize();
  document.getElementById("projects").classList.remove("is-reached");
  document.querySelector('.circle .path').classList.remove("offset");
  document.querySelectorAll(".fromBottom span").forEach(function(element) {
    element.classList.remove("appeared");
  });

  //FIRST SECTION
  if (index == 0) {
    let fromBottomElements = document.querySelectorAll('.landing .fromBottom');
    for(let i = 1; i <= fromBottomElements.length; i++){
      setTimeout(function() {
        animateFromBottom(".landing p:nth-of-type(" + i + ")");
      }, i * 50);
    }

    setTimeout(function() {
      randomize("#name");
    }, 100);

  //SECOND SECTION
  } else if (index == 1) {
    document.getElementById("projects").classList.add("is-reached");
    randomize("#worksTitle");
  
  //THIRD SECTION
  } else if (index == 2) {
    randomize("#skillsTitle");

    
    document.querySelector('.circle .path').classList.add("offset");
    
    let fromBottomElements = document.querySelectorAll('.items p');
    for(let i = fromBottomElements.length; i > 0; i--){
      setTimeout(function() {
        animateFromBottom(".items p:nth-of-type(" + i + ")");
      }, i*300 + 1000);
    }

  //FOURTH SECTION
  } else if (index == 3) {
    randomize("#aboutTitle");
  }
};


//--------------- EXPORT ---------------//
export {initFromBottom,  initRandomize, animateFromBottom, randomize, animateSection};