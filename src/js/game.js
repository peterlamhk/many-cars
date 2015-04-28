(function() {
  'use strict';

  function Game() {
    this.player = null;
    this.steeringAngle = 270;
    this.steeringMultiplier = 2;
    this.currentSpeed = 0;
    this.backwardSpeed = 0;
  }

  Game.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      // this.player = this.add.sprite(x, y, 'player');
      // this.player.anchor.setTo(0.5, 0.5);
      // this.input.onDown.add(this.onInputDown, this);

      this.car = this.add.sprite(x, y, 'cars');
      this.car.anchor.setTo(0.5, 0.5);
      // this.car.animations.add('turn', Phaser.Animation.generateFrameNames('car', 0, 23, '', 2), 5, true);
      // this.car.animations.play('turn');
      this.car.frame = 18;

      this.game.physics.enable(this.car, Phaser.Physics.ARCADE);
      this.car.body.maxVelocity.setTo(400, 400);

      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
      var x, y, cx, cy, dx, dy, angle, scale;

      x = this.input.position.x;
      y = this.input.position.y;
      cx = this.world.centerX;
      cy = this.world.centerY;

      angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      // this.player.angle = angle;

      dx = x - cx;
      dy = y - cy;
      scale = Math.sqrt(dx * dx + dy * dy) / 100;

      // this.player.scale.x = scale * 0.6;
      // this.player.scale.y = scale * 0.6;

      if (this.cursors.left.isDown) {
        if (this.currentSpeed >= 0) {
          this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
        } else {
          this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
        }
        this.car.frame = Math.floor(this.steeringAngle * 24 / 360);
      } else if (this.cursors.right.isDown) {
        if (this.currentSpeed >= 0) {
          this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
        } else {
          this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
        }
        this.car.frame = Math.floor(this.steeringAngle * 24 / 360);
      }

      if (this.cursors.up.isDown) {
        if (this.currentSpeed < 150) {
          this.currentSpeed += 4;
        }
        if (this.backwardSpeed < 0) {
          this.backwardSpeed += 4;
        }
      } else if (this.cursors.down.isDown) {
        if (this.currentSpeed > -100) {
          this.currentSpeed -= 4;
        } else if (this.backwardSpeed > -100){
          this.backwardSpeed -= 4;
        }
      } else {
        if (this.currentSpeed > 2) {
          this.currentSpeed -= 2;
          this.backwardSpeed -= 2;
        } else if (this.currentSpeed < -2){
          this.currentSpeed += 2;
          this.backwardSpeed += 2;
        } else {
          this.currentSpeed = 0;
          this.backwardSpeed = 0;
        }
      }

      if (this.currentSpeed >= 0) {
        this.game.physics.arcade.velocityFromAngle(this.steeringAngle, this.currentSpeed, this.car.body.velocity);
      } else {
        this.game.physics.arcade.velocityFromAngle(this.steeringAngle, this.backwardSpeed, this.car.body.velocity);
      }
    },

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Game = Game;

}());
