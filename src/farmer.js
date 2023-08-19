export function Farmer() {
  this.init = function () {
    this.canvas = document.getElementById('cv');
    this.player = document.getElementById('myImg');
    this.canvas.style.backgroundColor = "#000000";
    this.canvas.width = 1200;
    this.canvas.height = 800;
    this.ctxt = this.canvas.getContext('2d');
    this.resource_loaded = 0;
    this.total_resource = 2;
    this.load_resources();

    this.player = {};
    this.player.x = 0;
    this.player.y = 0;
    this.player.width = 120;
    this.player.height = 120;
    this.player.framex = 2;
    this.player.framey = 2;
    this.player.offsetx = 39;
    this.player.offsety = 17;

    this.camera = {};
    this.camera.x = -this.canvas.width / 2;
    this.camera.y = -this.canvas.height / 2;
  };

  this.load_resources = function () {
    var char = this;
    this.sprite_mainchar = new Image();
    this.sprite_mainchar.src = "https://github.com/modJordan/rpg/blob/main/src/images/charSprite.png";
    this.sprite_mainchar.addEventListener('load', function () {
      char.on_load_completed();
    }, false);
  };

  this.on_draw = function () {

    //Clear the canvas
    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw Main Characters
    this.ctxt.drawImage(this.sprite_mainchar,
      this.player.width * this.player.framex,
      this.player.height * this.player.framey,
      this.player.width,
      this.player.height,
      this.player.x - this.camera.x,
      this.player.y - this.camera.y);
  };

  this.bind_keyboard_events = function () {
    var char = this;
    document.addEventListener("keydown", function (evt) {
      char.on_keyDown(evt);
    }, false);
    document.addEventListener("keyup", function (evt) {
      char.on_keyUp(evt);
    }, false);
  };

  this.on_keyDown = function (evt) {
    var keyCode = evt.which ? evt.which : evt.keyCode;
    keyCode = this.wasd_to_arrow(keyCode);
  };

  this.on_keyUp = function (evt) {
    var keyCode = evt.which ? evt.which : evt.keyCode;
    keyCode = this.wasd_to_arrow(keycode);
  };

  this.wasd_to_arrow = function (keycode) {
    var newKeyCode = keyCode;
    if (keycode === 65) { newKeyCode = 37; }
    if (keyCode === 68) { newKeyCode = 39; }
    if (keycode === 87) { newKeyCode = 38; }
    if (keycode === 83) { newKeyCode = 40 }
    return newKeyCode;
  };

  this.on_timer = function () {
    //Update
    this.on_update();

    // Draw
    this.on_draw();

    var char = this;
    window.requestAnimationFrame(function () {
      char.on_timer();
    });
  };

  this.on_load_completed = function () {

    var char = this;
    this.resource_loaded += 1;
    this.update_loading_screen();

    if (this.resource_loaded === this.loaded.total_resource) {
      char.on_timer();
    }
  };

  this.update_loading_screen = function () {
    var percent_complete = (this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
    this.ctxt.clearReact(0, 0, this.canvas.width, this.canvas.height);
    this.ctxt.fillStyle = "white";
    this.ctxt.font = "14px Comic Sans MS";
    var msg = "Loading Resources . " + percent_complete + "% loaded";
    this.ctxt.fillText(msg, this.canvas.width / 2 - msg.length * 6 / 2, this.canvas.height / 2);
  };
}

