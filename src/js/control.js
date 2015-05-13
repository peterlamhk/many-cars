(function() {
  'use strict';

  function Control() {
    // this.sprite;
    // this.pad;
    // this.stick;
    // this.buttonA;

    this.buttonUp = null;
    this.buttonDown = null;
    this.buttonLeft = null;
    this.buttonRight = null;

    this.clickableAreaUp = null;
    this.clickableAreaDown = null;
    this.clickableAreaLeft = null;
    this.clickableAreaRigt = null;

    this.isUp = false;
    this.isDown = false;
    this.isLeft = false;
    this.isRight = false;

    this.rectWidth = 100;
    this.rectHeight = 50;

    this.playerColor = null;

    this.control = {};
    this.control.up = false;
    this.control.down = false;
    this.control.left = false;
    this.control.right = false;

    this.debugText = null;
  }

  Control.prototype = {
    init: function(){
      this.game.renderer.renderSession.roundPixels = true;
      // this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function(){
        this.load.atlas('buttons', 'assets/arrow_spritesheet.png', 'assets/arrow_spritesheet.json');
      // this.game.load.spritesheet('button', 'assets/arrow_button_spritesheet.png', 114, 94);
      this.load.image('green', 'assets/00ff00.png');
      this.load.image('purple', 'assets/8a00ff.png');
      this.load.image('red', 'assets/ff4e8d.png');
      this.load.image('yellow', 'assets/fff000.png');
    },

    create: function () {
        var width = this.game.width
        , height = this.game.height;

        var x = this.game.width / 10 * 4
        , y = this.game.height / 2;

        var _x = this.game.width - x;
        // this.add.image(0, 0, 'bg');

        var colorArr = ['yellow', 'green', 'red', 'purple'];
        var id = remote.playerId;
        this.sprite = this.add.sprite(width/2, height/2, colorArr[id-1]);
        this.sprite.anchor.set(0.5);

        // this.sprite = this.add.sprite(400, 350, 'ship');
        // this.sprite.texture.baseTexture.scaleMode = PIXI.NEAREST;
        // this.sprite.scale.set(2);
        // this.sprite.anchor.set(0.5);
        // this.sprite.angle = -90;
        // this.physics.arcade.enable(this.sprite);

        // this.pad = this.game.plugins.add(Phaser.Plugin.VirtualJoystick);

        // this.stick = this.pad.addStick(0, 0, 200, 'generic');
        // this.stick.alignBottomLeft(20);
        // this.stick.motionLock = Phaser.VirtualJoystick.HORIZONTAL;

        // this.buttonA = this.pad.addButton(500, 520, 'generic', 'button1-up', 'button1-down');
        // this.buttonA.alignBottomRight(20);
        this.clickableAreaUp = new Phaser.Rectangle(0, 0, x, y);
        this.clickableAreaDown = new Phaser.Rectangle(0, y, x, y);
        this.clickableAreaLeft = new Phaser.Rectangle(x, 0, _x/2, height);
        this.clickableAreaRight = new Phaser.Rectangle(x+_x/2, 0, _x/2, height);

        this.input.onDown.add(this.onDown, this);
        this.input.onUp.add(this.onUp, this);

        
        var graphics = this.game.add.graphics(0, 0);
        // graphics.beginFill(0xFFFFFF, 1);
        // graphics.drawRect(this.clickableAreaUp.x, this.clickableAreaUp.y, this.clickableAreaUp.width, this.clickableAreaUp.height);
        // graphics.beginFill(0xFF0000, 1);
        // graphics.drawRect(this.clickableAreaDown.x, this.clickableAreaDown.y, this.clickableAreaDown.width, this.clickableAreaDown.height);
        // graphics.beginFill(0x0000FF, 1);
        // graphics.drawRect(this.clickableAreaLeft.x, this.clickableAreaLeft.y, this.clickableAreaLeft.width, this.clickableAreaLeft.height);
        // graphics.beginFill(0x00FF00, 1);
        // graphics.drawRect(this.clickableAreaRight.x, this.clickableAreaRight.y, this.clickableAreaRight.width, this.clickableAreaRight.height);

        this.buttonUp = this.add.sprite(x, y, 'buttons');
        this.buttonUp.anchor.set(0.5);
        this.buttonUp.x = (this.clickableAreaUp.x + this.clickableAreaUp.width)/2;
        this.buttonUp.y = (this.clickableAreaUp.y + this.clickableAreaUp.height)/2;
        this.buttonUp.angle = 90;
        this.buttonUp.frame = 1;

        this.buttonDown = this.add.sprite(x, y, 'buttons');
        this.buttonDown.anchor.set(0.5);
        this.buttonDown.x = (this.clickableAreaDown.x + this.clickableAreaDown.width)/2;
        this.buttonDown.y = (this.clickableAreaDown.y + this.clickableAreaDown.height)/2+this.buttonDown.height;
        this.buttonDown.angle = 270;
        this.buttonDown.frame = 1;

        this.buttonLeft = this.add.sprite(x, y, 'buttons');
        this.buttonLeft.anchor.set(0.5);
        this.buttonLeft.x = (this.buttonLeft.x + this.buttonLeft.width);
        this.buttonLeft.frame = 1;

        this.buttonRight = this.add.sprite(x, y, 'buttons');
        this.buttonRight.anchor.set(0.5);
        this.buttonRight.x = (this.buttonRight.x + this.buttonRight.width) + this.buttonRight.width * 3;
        this.buttonRight.scale.x = -1;
        this.buttonRight.frame = 1;

        // button.onInputOver.add(over, this);
        // button.onInputOut.add(out, this);
        // button.onInputUp.add(up, this);

        this.debugText = this.add.bitmapText(width/2, 20, 'minecraftia', '0, 0, 0' );
        this.debugText.anchor.set(0.5);
        this.debugText.align = 'center';

        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.motion, false);
        }
    },

    motion: function(event){
        remote.motion = event.accelerationIncludingGravity;
    },

    update: function() {
        if( remote.motion != null && remote.motion.x != null ) {
            this.debugText.setText('x: '+ remote.motion.x +', y: '+ remote.motion.y +', z: '+ remote.motion.z);
        } else {
            this.debugText.setText('Accelerometer control is not supported');
            this.debugText.tint = 0xFF9966;
        }
    },

    onDown: function (pointer) {
        var x = pointer.positionDown.x;
        var y = pointer.positionDown.y;

      if (this.clickableAreaUp.contains(x, y)){
        this.control.up = true;
        this.buttonUp.frame = 0;
      } else if (this.clickableAreaDown.contains(x, y)){
        this.control.down = true;
        this.buttonDown.frame = 0;
      } else if (this.clickableAreaLeft.contains(x, y)){
        this.control.left = true;
        this.buttonLeft.frame = 0;
      } else if (this.clickableAreaRight.contains(x, y)){
        this.control.right = true;
        this.buttonRight.frame = 0;
      }

      this.updateControl();
    },

    onUp: function (pointer){
        var x = pointer.positionDown.x;
        var y = pointer.positionDown.y;
        if (this.clickableAreaUp.contains(x, y)){
            this.control.up = false;
            this.buttonUp.frame = 1;
        } else if (this.clickableAreaDown.contains(x, y)){
            this.control.down = false;
            this.buttonDown.frame = 1;
        } else if (this.clickableAreaLeft.contains(x, y)){
            this.control.left = false;
            this.buttonLeft.frame = 1;
        } else if (this.clickableAreaRight.contains(x, y)){
            this.control.right = false;
            this.buttonRight.frame = 1;
        }

      this.updateControl();
    },

    updateControl: function() {
        remote.emitMove(this.control);
    }
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Control = Control;

}());
