function Farmer() {
  this.init = function () {
    this.canvas = document.getElementById(cv);
    this.canvas.style.backgroundColor = "#000000";
    this.canvas.width = 1200;
    this.canvas.height = 800;
    this.ctxt = this.canvas.getContext('2d');
    this.resource_loaded = 0;
    this.total_resource = 2;
    this.load_resources();
  }

  this.load_resources = function () {
    var char = this;
    this.sprite_mainchar = new Image();
    this.sprite_mainchar.src = 'src/images/charSprite.png';
    this.sprite_mainchar.addEventListener('load', function () {
      char.on_load_completed();
    }, false);

    this.on_load_completed = function () {

      var char = this;
      this.resource_loaded += 1;
      this.update_loading_screen();

      if (this.resource_loaded === this.loaded.total_resource) {
        console.log("Loading Complete");
      }
    }
    this.update_loading_screen = function () {
      var percent_complete = (this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
      this.ctxt.clearReact(0, 0, this.canvas.width, this.canvas.height);
      this.ctxt.fillStyle = "white";
      this.ctxt.font = "14px Comic Sans MS";
      var msg = "Loading Resources . " + percent_complete + "% loaded";
      this.ctxt.fillText(msg, this.canvas.width / 2 - msg.length * 6 / 2, this.canvas.height / 2);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var char = new Farmer();
  char.init();
});
