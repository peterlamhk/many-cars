(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {

    preload: function () {
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.game.input.maxPointers = 1;

      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth =  480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 960;
      this.game.scale.maxHeight = 540;
      this.game.scale.forceOrientation(true);
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.setMaximum();
      this.game.scale.setScreenSize(true);

      this.game.state.start('preloader');
    }
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Boot = Boot;

}());

