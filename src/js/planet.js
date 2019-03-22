// LIBRARIES
var THREE = require("three");

//IMAGES & TEXTURES
var noiseImage = require("../images/texture/noise-large.png");
var glowImage = require("../images/texture/glow-small.png");

var planetTexture = new THREE.TextureLoader().load(noiseImage);
var glowTexture = new THREE.TextureLoader().load(glowImage);

class PlanetScene {
  constructor() {
    //SCENE
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWodth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add("canvas3D");
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    //LIGHTS
    this.light = new THREE.PointLight(0xffe0e0, 3, 100);
    this.light.position.set(0, 15, 2);
    this.scene.add(this.light);

    //PLANET
    this.planetGeometry = new THREE.SphereGeometry(2.8, 50, 50);
    this.planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.7,
      metalness: 0.4
    });

    this.planet = new THREE.Mesh(this.planetGeometry, this.planetMaterial);
    this.planet.rotation.z += 90;
    this.planet.position.z += -20;
    this.scene.add(this.planet);

    //GLOW
    this.glowGeometry = new THREE.PlaneGeometry(7.4, 7.4, 32);
    this.glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: glowTexture
    });
    this.glowMaterial.transparent = true;

    this.glow = new THREE.Mesh(this.glowGeometry, this.glowMaterial);
    this.glow.position.y = 0.8;
    this.glow.position.z = -20;
    this.scene.add(this.glow);

    //GRID
    this.horizontalGrid = new THREE.GridHelper(100, 20);
    this.horizontalGrid.position.y = -25;
    this.scene.add(this.horizontalGrid);

    this.clock = new THREE.Clock();
  };

  //RENDER
  

  render(){
    var delta = this.clock.getDelta();

    this.planet.rotation.x -= (Math.PI / 180) * 10 * delta;
    this.glow.rotation.z += (Math.PI / 180) * 80 * delta;

    this.renderer.render(this.scene, this.camera);
  }
}

export {THREE, noiseImage, glowImage, planetTexture, glowTexture};
export default PlanetScene;