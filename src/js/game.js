(function() {
  'use strict';

  function Game() {
    this.player = null;
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
      this.car.animations.add('turn', Phaser.Animation.generateFrameNames('car', 0, 23, '', 2), 5, true);
      this.car.animations.play('turn');
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
    },

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Game = Game;

}());
