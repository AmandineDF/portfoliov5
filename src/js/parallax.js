//MOUSEMOVE PARALLAX
class Parallax {
  constructor(intensity, smoothing) {
    this.intensity = intensity;
    this.smoothing = smoothing;

    this.mouse = { x: -1, y: -1 };
    this.mouseDelta = { x: 0, y: 0 };

    this.currentDelta = { x: 0, y: 0 };

    this.queryElements();

    window.addEventListener("mousemove", event => {
      this.mouse = { x: event.clientX, y: event.clientY };
      let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      this.mouseDelta = {
        x: event.clientX - origin.x,
        y: event.clientY - origin.y
      };
    });

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
    this.currentDelta.x += (this.mouseDelta.x - this.currentDelta.x) * this.smoothing;
    this.currentDelta.y += (this.mouseDelta.y - this.currentDelta.y) * this.smoothing;

    let p = this.getMovement(); //p will be the new position of the element
    this.elements.forEach(element => {
      let depth = element.getAttribute("data-depth");
      let target = { x: p.x * depth, y: p.y * depth };
      TweenMax.set(element, {
        x: target.x + "px",
        y: target.y + "px",
        force3D: true
      });
    });
    //requestAnimationFrame(() => { this.update(); });
  }
}

export default Parallax;