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

    this.rectWidth = 100;
    this.rectHeight = 50;
  }

  Control.prototype = {
    init: function(){
      this.game.renderer.renderSession.roundPixels = true;
      // this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function(){
      this.game.load.spritesheet('button', 'assets/arrow_button_spritesheet.png', 114, 94);
      // this.load.image('ship', 'assets/virtualjoystick/thrust.png');
      // this.load.image('bg', 'assets/virtualjoystick/sky2.png');
    },

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;
        // this.add.image(0, 0, 'bg');

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
        // this.input.onDown.add(this.onDown, this);
        this.buttonUp = this.game.add.button(x, y, 'button', this.buttonUpOnClick, this, 2, 1, 0);
        this.buttonUp.anchor.set(0.5);
        this.buttonUp.x = x - this.buttonUp.width;
        this.buttonUp.y = y - this.buttonUp.height/1.5;
        this.buttonUp.angle = 90;

        this.buttonDown = this.game.add.button(x, y, 'button', this.buttonDownOnClick, this, 2, 1, 0);
        this.buttonDown.anchor.set(0.5);
        this.buttonDown.x = this.buttonUp.x-3;
        this.buttonDown.y = y + this.buttonDown.height/1.5;
        this.buttonDown.angle = 270;

        this.buttonLeft = this.game.add.button(x, y, 'button', this.buttonLeftOnClick, this, 2, 1, 0);
        this.buttonLeft.anchor.set(0.5);
        this.buttonLeft.x = x + this.buttonLeft.width/3;

        this.buttonRight = this.game.add.button(x, this.buttonLeft.y, 'button', this.buttonRightOnClick, this, 2, 1, 0);
        this.buttonRight.anchor.set(0.5);
        this.buttonRight.x = this.buttonLeft.x + this.buttonRight.width*1.1;
        this.buttonRight.scale.x = -1;

        // button.onInputOver.add(over, this);
        // button.onInputOut.add(out, this);
        // button.onInputUp.add(up, this);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('room');
    },

    buttonUpOnClick: function(){

    },
    
    buttonDownOnClick: function(){

    },
    
    buttonLeftOnClick: function(){

    },
    
    buttonRightOnClick: function(){

    }
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Control = Control;

}());
