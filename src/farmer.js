/* eslint-disable no-console */
export class Farmer {
  constructor() {
    this.init();
  }

  init() {
    this.canvas = document.getElementById('cv');
    this.sprite_mainchar = document.getElementById('myImg');
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
    this.player.control_direction = [0, 0, 0, 0];
    this.player.box_collider = {};
    this.player.box_collider.width = 34;
    this.player.box_collider.height = 75;

    this.camera = {};
    this.camera.x = -this.canvas.width / 2;
    this.camera.y = -this.canvas.height / 2;
    this.player.walking = 0;
    this.player.tick = 0;
    this.layerIdMap = {};
  }

  load_resources() {
    this.sprite_mainchar_img = new Image();
    this.sprite_mainchar_img.src = "src/images/spriteSheet.png";
    const char = this;
    this.sprite_mainchar_img.addEventListener('load', function () {
      char.on_load_completed();
    }, false);


    loadJSON("src/map/medieval.json" + this.level + ".json?", function (map) {
      char.map = map;
      char.load_map_resources();
      char.on_load_completed();
    }, false);

  }

  load_map_resources() {

    var dw = this;
    var imagePath = "images";

    for (var i = 0; i < this.map.tilesets.length; i++) {
      if (this.map.tilesets[i].name == "medieval") {

        // Tiles
        this.sprite_bgtiles = new Image();
        this.sprite_bgtiles.src = imagePath + "/" + this.baseName(this.map.tilesets[i].image);
        this.sprite_bgtiles.addEventListener('load', function () {
          dw.on_load_completed();
        }, false);
      }
    }
  }

  on_draw() {

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
  }

  bind_keyboard_events() {
    var char = this;
    document.addEventListener("keydown", function (evt) {
      char.on_keyDown(evt);
    }, false);
    document.addEventListener("keyup", function (evt) {
      char.on_keyUp(evt);
    }, false);
  }

  on_keyDown(evt) {
    let keyCode = evt.which ? evt.which : evt.keyCode;
    keyCode = this.wasd_to_arrow(keyCode);
    if (keyCode >= 37 && keyCode <= 40) {
      this.player.control_direction[keyCode - 37] = 1;
    }
  }

  on_keyUp(evt) {
    let keyCode = evt.which ? evt.which : evt.keyCode;
    keyCode = this.wasd_to_arrow(keyCode);
    if (keyCode >= 37 && keyCode <= 40) {
      this.player.control_direction[keyCode - 37] = 0;
    }
  }

  wasd_to_arrow(keyCode) {
    switch (keyCode) {
      case 65: return 37;
      case 68: return 39;
      case 87: return 38;
      case 83: return 40;
      default: return keyCode;
    }
  }

  update_camera_position() {

    var camera_target_x = this.player.x - this.canvas.width / 2;
    this.camera.x += ((camera_target_x - this.camera.x) / 10 >> 0);

    var camera_target_y = this.player.y - this.canvas.height / 2;
    this.camera.y += ((camera_target_y - this.camera.y) / 10 >> 0);

  }


  update_player_animation() {
    // Walking frames
    if (this.player.walking > 0) {
      this.player.framey = this.player.direction;
      this.player.framex = 0;

      if (this.player.tick > this.setting_walkcycle_interval) {
        this.player.framex = (this.player.framex + 2) % 8;
        this.player.tick = 0;
      }
    }
    // Idling frames
    else if (this.player.walking === 0) {
      this.player.framex = this.player.framex % 4;
      this.player.framey = 2 + this.player.direction;

      if (this.player.tick > 12) {
        this.player.framex = (this.player.direction === 0) ? (this.player.framex + 1) % 4 : (this.player.framex + 3) % 4;
        this.player.tick = 0;
      }
    }
    this.player.tick += 1;
  }


  on_timer() {
    // Update
    this.on_update();
    this.on_draw();
    this.update_player_action();
    this.update_player_animation();

    const char = this;
    window.requestAnimationFrame(function () {
      char.on_timer();
    });
  }

  on_update() {
    // Handle player movement
    const speed = 5;
    if (this.player.control_direction[0] === 1) { // Left arrow key
      this.player.x -= speed;
    }
    if (this.player.control_direction[1] === 1) { // Up arrow key
      this.player.y -= speed;
    }
    if (this.player.control_direction[2] === 1) { // Right arrow key
      this.player.x += speed;
    }
    if (this.player.control_direction[3] === 1) { // Down arrow key
      this.player.y += speed;
    }
  }

  on_load_completed() {

    this.resource_loaded += 1;
    this.update_loading_screen();

    if (this.resource_loaded === this.total_resource) {
      this.on_timer();

    }
  }

  update_player_action() {
    // Check if the player is moving and update animation state accordingly
    if (this.player.control_direction.some(dir => dir === 1)) {
      this.player.walking = 1;
    } else {
      this.player.walking = 0;
    }

    // TODO: Add any other player-specific action handling here, like jumping, shooting, etc.
  }


  update_loading_screen() {
    var percent_complete = (this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctxt.fillStyle = "white";
    this.ctxt.font = "14px Comic Sans MS";
    var msg = "Loading Resources . " + percent_complete + "% loaded";
    this.ctxt.fillText(msg, this.canvas.width / 2 - msg.length * 6 / 2, this.canvas.height / 2);
  }

  loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText));
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }

  layer_id() {
    for (var i = 0; i < this.map.layers.length; i++) {
      this.layerIdMap[this.map.layers[i].name] = i;
    }
  }

  setting_minblocksize() {
    this.map.tilesets[this.layer_id["background"]].tilewidth;
    this.setting_bgtiles_x = this.map.tilesets[this.layer_id["background"]].imagewidth / this.setting_minblocksize;

    var cam_tile_y = this.camera.y / this.setting_minblocksize >> 0;
    var cam_tile_x = this.camera.x / this.setting_minblocksize >> 0;
    var tilex_count = this.canvas.width / this.setting_minblocksize >> 0;
    var tiley_count = this.canvas.height / this.setting_minblocksize >> 0;

    if (this.map.layers) {
      for (var layer = 0; layer < 2; layer += 1) {

        for (var i = cam_tile_y - 1; i < cam_tile_y + tiley_count + 2; i++) {
          for (var j = cam_tile_x - 1; j < cam_tile_x + tilex_count + 2; j++) {

            let data = 0;
            if (i >= 0 && j >= 0 && i < this.map.layers[layer].height && j < this.map.layers[layer].width) {

              let data = this.map.layers[layer].data[i * this.map.layers[layer].width + j];

              var tile_framex = (data % this.setting_bgtiles_x) - 1;
              var tile_framey = (data / this.setting_bgtiles_x) >> 0;
              var sprite = this.sprite_bgtiles;

              if (tile_framex >= 0 && tile_framey >= 0) {

                this.ctxt.drawImage(sprite,
                  this.setting_minblocksize * tile_framex,
                  this.setting_minblocksize * tile_framey,
                  this.setting_minblocksize,
                  this.setting_minblocksize,
                  (j * this.setting_minblocksize - this.camera.x) >> 0,
                  (i * this.setting_minblocksize - this.camera.y) >> 0,
                  this.setting_minblocksize,
                  this.setting_minblocksize
                );
              }

            }
          }
        }
      }
    }
  }


  collide_with_wall(box_collider, direction, delta) {

    for (var j = 0; j < 3; j++) {

      var pof_x = null;
      var pof_y = null;

      if (direction == 3) {

        pof_x = box_collider.x + j * (box_collider.width - 1) / 2;
        pof_y = box_collider.y + box_collider.height + delta;

      } else if (direction == 1) {

        pof_x = box_collider.x + j * (box_collider.width - 1) / 2;
        pof_y = box_collider.y + delta;


      } else if (direction == 0) {

        pof_x = box_collider.x + delta;
        pof_y = box_collider.y + j * (box_collider.height - 1) / 2;


      } else if (direction == 2) {

        pof_x = box_collider.x + box_collider.width + delta;
        pof_y = box_collider.y + j * (box_collider.height - 1) / 2;





        if (pof_x != null && pof_y != null && this.map.layers) {

          var pof_tile_y = pof_y / this.setting_minblocksize >> 0;
          var pof_tile_x = pof_x / this.setting_minblocksize >> 0;

          // Static foreground
          for (var k = pof_tile_y - 2; k < pof_tile_y + 2; k++) {
            for (var l = pof_tile_x - 2; l < pof_tile_x + 2; l++) {


              let data = this.map.layers[this.layer_id["foreground"]].data[k * this.map.layers[this.layer_id["foreground"]].width + l];

              if (data > 0) {

                if (pof_x >= l * this.setting_minblocksize && pof_x <= (l + 1) * this.setting_minblocksize &&
                  pof_y >= k * this.setting_minblocksize && pof_y <= (k + 1) * this.setting_minblocksize) {

                  if (direction == 3) {
                    return pof_y - k * this.setting_minblocksize;

                  } else if (direction == 1) {

                    return (k + 1) * this.setting_minblocksize - pof_y;

                  } else if (direction == 0 || direction == 2) {

                    return l;

                  }

                }
              }
            }
          }

        }




      }
    }
    return 0;
  }
}

