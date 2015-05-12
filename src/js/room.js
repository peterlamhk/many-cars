(function () {
  'use strict';

  function Room() {
    this.titleTxt = null;
    this.startTxt = null;
    this.playerTitle = null;
    this.playerTxt = [];
    this.playerList = [];

    this.maxPlayer = 4;
    this.rectWidth = 50;
    this.color = [0xFFFF00, 0x0FF00, 0xFF0000, 0x0000FF];
  }

  Room.prototype = {
    preload: function () {
      // this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      var size=0, i=0;

      this.titleTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Room ' + this.game.session );
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.titleTxt.textWidth / 2;
      this.titleTxt.y = this.titleTxt.textHeight / 2;

      this.playerTitle = this.add.bitmapText(0, 0, 'minecraftia', 'Game Players:' );
      this.titleTxt.align = 'left';
      this.playerTitle.x = this.titleTxt.textWidth / 2;
      this.playerTitle.y = this.titleTxt.y + this.titleTxt.textHeight +this.playerTitle.textHeight / 2;
      
      this.startTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Start Game' );
      this.titleTxt.align = 'right';
      this.startTxt.x = this.game.width - this.startTxt.textWidth;
      this.startTxt.y = this.game.height - this.startTxt.textHeight;

      this.startTxt.inputEnabled = true;
      this.startTxt.events.onInputDown.add(this.onStartButtonDown, this);

      size = this.playerTitle.textHeight;
      for (i = 0; i < this.maxPlayer; i++){
        this.playerTxt.push(this.add.bitmapText(0, 0, 'minecraftia', 'Player '+ i-(-1) ));
        this.titleTxt.align = 'left';
        this.playerTxt[i].tint=this.color[i];
        this.playerTxt[i].x = this.titleTxt.textWidth / 2;
        this.playerTxt[i].y = this.playerTitle.y + 5 + this.playerTitle.textHeight * (i+1);
      }

      // set listener to update player changes
      var that = this;
      viewer.initRmChangeListener(function(list) {
        that.playerList = list;
        that.updatePlayers();
      })
    },

    updatePlayers: function(){
      for(var i = 1; i <= this.maxPlayer; i++){
        if( this.playerList.indexOf(i) == -1 ) {
          this.playerTxt[i-1].setText(' ');
        } else {
          this.playerTxt[i-1].setText('Player '+i);
        }
      }
    },

    onStartButtonDown: function(){
      this.game.state.start('game');
    }
  };
  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Room = Room;
}());

