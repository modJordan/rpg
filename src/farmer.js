export class Farmer {

  init() {
    this.sprite = new Image();
    this.sprite.src = "src/images/spriteSheet.png";
    window.requestAnimationFrame(this.draw.bind(this));

    this.canvas = document.getElementById('cv');
    this.player = document.getElementById('myImg');
    this.canvas.style.backgroundColor = "#000000";
    this.canvas.width = 1200;
    this.canvas.height = 800;
    this.ctxt = this.canvas.getContext('2d');
    this.resource_loaded = 0;
    this.total_resource = 2;
    this.load_resources();

    this.camera = {};
    this.camera.x = -this.canvas.width / 2;
    this.camera.y = -this.canvas.height / 2;
  }

  load_resources() {
    this.sprite.addEventListener('load', () => {
      this.draw();
    }, false);
  }


  draw(9) {
    this.ctxt.drawImage(
      this.sprite_mainchar,
      this.player.width * this.player.framex,
      this.player.height * this.player.framey,
      this.player.width,
      this.player.height,
      this.player.x - this.camera.x,
      this.player.y - this.camera.y,
      this.player.width,  // missing
      this.player.height  // missing
    );
    const ctx = document.getElementById("cv").getContext("2d");
    ctx.save();
    //Clear the canvas
    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw Main Characters
    this.ctxt.drawImage(this.sprite,
      this.player.width * this.player.framex,
      this.player.height * this.player.framey,
      this.player.width,
      this.player.height,
      this.player.x - this.camera.x,
      this.player.y - this.camera.y);
  }
}



