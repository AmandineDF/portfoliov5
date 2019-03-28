class SinWave{
    constructor(selector){
        //DOMELEMENT
        this.DOMElement = document.querySelector(selector);
        this.ctx = this.DOMElement.getContext("2d");
        this.DOMElement.height = window.innerHeight;
        this.DOMElement.width = window.innerWidth;

        window.addEventListener('resize', ()=>{
            this.DOMElement.height = window.innerHeight;
            this.DOMElement.width = window.innerWidth;
        });

        this.waveCounter = 0;
        this.deltaTime = 0;
        this.lastTime = Date.now();

        //this.update();
        this.color = "white";
    }

    update() {
        this.deltaTime = (Date.now() - this.lastTime) / 1000;
        this.lastTime = Date.now();

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        //Animation
        this.waveCounter += 0.08 * Math.PI * 2 * this.deltaTime;

        //Draw
        this.ctx.beginPath();
        this.ctx.moveTo(0, window.innerHeight);

        //STYLE
        this.ratio = window.innerWidth / 1920;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 350 * this.ratio;
        this.ctx.globalAlpha = 0.2; //Note : globalAlpha is for all of the canvas
        this.ctx.filter = "blur(40px)";

        //ANIMATION COUNTERS
        this.precision = 15;
        this.amplitude = 100 * this.ratio;

        for(let i = 0; i <= this.precision; i++){
            let sin = Math.sin(this.waveCounter + (i / this.precision) * Math.PI * 2);
            let x = (window.innerWidth / this.precision) * i + sin * this.amplitude;
            let y = (window.innerHeight / this.precision) * (this.precision - i) + sin * this.amplitude;
            this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
    }
}

export default SinWave;