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
  var element = selector;
  if(typeof(selector) == "string"){
    element = document.querySelector(selector);
  }
  
  element.style.opacity = 1;

  var letters = element.querySelectorAll("span");
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
      setTimeout(updateRandomize, 30);
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
  document.querySelector('.skills__circle .path').classList.remove("offset");
  document.querySelectorAll(".fromBottom span").forEach(function(element) {
    element.classList.remove("appeared");
  });
  document.querySelectorAll('.leftNav li')[0].classList.remove('active');

  var lis = document.querySelectorAll('.leftNav li');
  for(let i = 0; i < lis.length; i++) {
    let li = lis[i];
    
    if( i == index){
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  }

  //FIRST SECTION
  if (index == 0) {
    let fromBottomElements = document.querySelectorAll('.intro .fromBottom');
    for(let i = 0; i < fromBottomElements.length-1;i++){
      setTimeout(function() {
        animateFromBottom(fromBottomElements[i]);
      }, i * 400);
    }

    setTimeout(function() {
      randomize("#name");
    }, 1800);

    setTimeout(function() {
      animateFromBottom(".intro p:nth-of-type(4)");
    }, 2800);

    setTimeout(function() {
      document.querySelector('.scrollIcon').classList.add('appeared');
    }, 3500);



  //SECOND SECTION
  } else if (index == 1) {
    document.getElementById("projects").classList.add("is-reached");
    randomize("#worksTitle");
  
  //THIRD SECTION
  } else if (index == 2) {
    randomize("#skillsTitle");

    
    document.querySelector('.skills__circle .path').classList.add("offset");
    
    let leftElements = document.querySelectorAll('.skillsList__left p');
    for(let i = leftElements.length - 1; i >= 0; i--){
      setTimeout(function() {
        animateFromBottom(leftElements[i]);
      }, i*300 + 1000);
    }

    let rightElements = document.querySelectorAll('.skillsList__right p');
    for(let i = 0; i < rightElements.length; i++){
      setTimeout(function() {
        animateFromBottom(rightElements[i]);
      }, i*300 + 1000);
    }
    
    //FAIRE 2 for gauche et droite

  //FOURTH SECTION
  } else if (index == 3) {
    randomize("#aboutTitle");

  //FIFTH SECTION
  } else if (index == 4) {
    randomize('#contactQuestion');
    setTimeout(function() {
      animateFromBottom("#mail");
    }, 1000);
  }
};


//--------------- EXPORT ---------------//
export {initFromBottom,  initRandomize, animateFromBottom, randomize, animateSection};