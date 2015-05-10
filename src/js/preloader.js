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
      this.load.atlas('cars', 'assets/cars_base.png', 'assets/cars_base.json');
      this.load.image('track1aL', 'assets/track1aL.png');
      this.load.image('track1aR', 'assets/track1aR.png');
      this.load.image('track1bL', 'assets/track1bL.png');
      this.load.image('track1bR', 'assets/track1bR.png');
      this.load.image('track1c', 'assets/track1c.png');

      this.load.physics('physicsData', 'assets/tracks.json');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        // this.game.state.start('menu');
        this.game.state.start('game');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Preloader = Preloader;

}());
