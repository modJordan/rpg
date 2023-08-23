export class Farmer {
  constructor() {
    this.sprites = {
      "idleOne": {
        x: 0,
        y: 0,
        w: 90,
        h: 90
      },
      "idleTwo": {
        x: 90,
        y: 0,
        w: 90,
        h: 90
      },
    }
  }
  init() {
    this.sprite = new Image();
    this.sprite.src = "src/images/spriteSheet.png";

    this.canvas = document.getElementById('cv');
    this.player = document.getElementById('myImg');
    this.canvas.style.backgroundColor = "#000000";
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.ctxt = this.canvas.getContext('2d');
    this.resource_loaded = 0;
    this.total_resource = 2;

    this.camera = {
      x: -this.canvas.width / 2,
      y: -this.canvas.height / 2
    };

    this.sprite.onload = () => {
      this.drawSprite("idleOne", 20, 50),
        this.drawSprite("idleTwo", 100, 50)
    };
  }
  drawSprite(name, x, y) {
    let s = this.sprites[name];
    this.ctxt.drawImage(this.sprite, s.x, s.y, s.w, s.h, x, y, s.w, s.h);
  }

  drawMainCharacter() {
    // Clear the canvas
    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the main character
    this.ctxt.drawImage(this.sprite,
      this.player.width * this.player.framex,
      this.player.height * this.player.framey,
      this.player.width,
      this.player.height,
      this.player.x - this.camera.x,
      this.player.y - this.camera.y,
      this.player.width,
      this.player.height
    );
  }
}



