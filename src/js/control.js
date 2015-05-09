(function() {
  'use strict';

  function Control() {
    this.sprite;
    this.pad;
    this.stick;
    this.buttonA;
  }

  Control.prototype = {
    init: function(){
      this.game.renderer.renderSession.roundPixels = true;
      // this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function(){
      this.load.atlas('generic', 'assets/virtualjoystick/skins/generic-joystick.png', 'assets/virtualjoystick/skins/generic-joystick.json');
      // this.load.image('ship', 'assets/virtualjoystick/thrust.png');
      // this.load.image('bg', 'assets/virtualjoystick/sky2.png');
    },

    create: function () {
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
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('room');
    }


  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Control = Control;

}());
