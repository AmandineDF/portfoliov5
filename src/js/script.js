window.onload = function() {
  //---- SCRIPT ----//
  var loader = document.getElementById("loader");
  setTimeout(function() {
    loader.style.opacity = 0;
  }, 500);

  //---- SIN WAVE ----//
  let canvas = document.querySelector(".wave");
  let ctx = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  window.onresize = function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  };

  var counter = 0;
  var deltaTime = 0;
  var lastTime = Date.now();

  function update() {
    //Delta Time
    deltaTime = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //Animation
    counter += 0.08 * Math.PI * 2 * deltaTime; //percent(animation speed) * one sin * per second

    //Draw
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight);

    var ratio = window.innerWidth / 1920;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 350 * ratio;

    var precision = 15;
    var amplitude = 100 * ratio;

    for (let i = 0; i <= precision; i++) {
      let sin = Math.sin(counter + (i / precision) * Math.PI * 2);
      let x = (window.innerWidth / precision) * i + sin * amplitude;
      let y =
        (window.innerHeight / precision) * (precision - i) + sin * amplitude;

      ctx.lineTo(x, y);
    }

    ctx.globalAlpha = 0.05; //Note : globalAlpha is for all of the canvas
    ctx.stroke();
    ctx.filter = "blur(20px)";

    requestAnimationFrame(update);
  }

  update();

  //---- PARTICLES ----//
  setInterval(function() {
    var particle = document.createElement("div");
    particle.style.top = window.innerHeight * Math.random() + "px";
    particle.style.left = window.innerWidth * Math.random() + "px";

    var span = document.createElement("span");
    span.innerHTML = Math.random() > 0.5 ? "◯" : "+";
    span.style.fontSize = 10 * Math.random() + 20 + "px";

    var particles = document.getElementById("particles");
    particle.append(span);
    particles.append(particle);

    setTimeout(function() {
      particle.remove();
    }, 10000);
  }, 1000);
};
