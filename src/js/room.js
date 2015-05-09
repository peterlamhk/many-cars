(function () {
  'use strict';

  function Room() {
    this.titleTxt = null;
    this.playerTxt = null;
    this.startTxt = null;
    this.playerList = [];
  }

  Room.prototype = {
    preload: function () {
      // this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.titleTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Room ' + this.game.session );
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.titleTxt.textWidth / 2;
      this.titleTxt.y = this.titleTxt.textHeight / 2;

      this.playerTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Player' );
      this.titleTxt.align = 'left';
      this.playerTxt.x = this.titleTxt.textWidth / 2;
      this.playerTxt.y = this.titleTxt.y + this.titleTxt.textHeight +this.playerTxt.textHeight / 2;
      this.updatePlayers();

      this.startTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Start Game' );
      this.titleTxt.align = 'right';
      this.startTxt.x = this.game.width - this.startTxt.textWidth;
      this.startTxt.y = this.game.height - this.startTxt.textHeight;

      this.startTxt.inputEnabled = true;
      this.startTxt.events.onInputDown.add(this.onStartButtonDown, this);
    },

    playersToString: function(){
      var result = 'Players: \n';
      if (!(this.playerList.length ===0 || this.playerList === null)){
        var i;
        for (i=0; i < this.playerList.length; i++){
          result = result + '\n' + i + ' ' + this.playerList[i];
        }
      }
      return result;
    },

    updatePlayers: function(){
      this.playerTxt.setText(this.playersToString());
    },

    onStartButtonDown: function(){
      this.game.state.start('game');
    }
  };
  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Room = Room;
}());

