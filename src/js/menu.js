(function() {
  'use strict';

  function Menu() {
    // this.titleTxt = null;
    // this.startTxt = null;

    this.bg = null;
    this.startBtn = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;


      // this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Example Game' );
      // this.titleTxt.align = 'center';
      // this.titleTxt.x = x - this.titleTxt.textWidth / 2;

      // y = y + this.titleTxt.height + 5;
      // this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
      // this.startTxt.align = 'center';
      // this.startTxt.x = x - this.startTxt.textWidth / 2;
      
      // this.input.onDown.add(this.onDown, this);
      // this.titleTxt.inputEnabled = true;
      // this.titleTxt.events.onInputDown.add(this.onDown, this);

      this.bg = this.game.add.sprite(x, y, 'background');
      this.bg.anchor.set(0.5);
      this.bg.scale.x = 0.5;
      this.bg.scale.y = 0.5;

      this.startBtn = this.game.add.sprite(this.game.width-150, this.game.height-90, 'start');
      this.startBtn.anchor.set(0.5);
      this.startBtn.scale.x = 0.5;
      this.startBtn.scale.y = 0.5;
      this.startBtn.inputEnabled = true;
      this.startBtn.events.onInputDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      if (this.game.device.desktop){
        viewer.init();
        var that = this;
        viewer.createRoom(function(sessionId) {
          that.game.session = sessionId;
          that.game.state.start('room');
        });
      } else{
        remote.init();
        this.game.state.start('lobby');
      }
    }


  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Menu = Menu;

}());
