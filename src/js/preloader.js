(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);

      this.loadResources();
    },

    loadResources: function () {
      this.load.image('player', 'assets/player.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
      this.load.atlas('cars', 'assets/car_spritesheet.png', 'assets/car_spritesheet.json');
      this.load.image('track1', 'assets/track1.png');
      this.load.image('track2', 'assets/track2.png');
      this.load.image('track3', 'assets/track3.png');
      this.load.image('zero', 'assets/FFFFFF-0.png');
      this.load.image('background', 'assets/background.png');
      this.load.image('start', 'assets/start.png');
      this.load.image('restart', 'assets/restart.png');
      this.load.image('play', 'assets/play.png');
      this.load.image('join', 'assets/join.png');
      this.load.image('initline', 'assets/initline.png');
      this.load.physics('physicsData', 'assets/physicsData.json');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Preloader = Preloader;

}());
