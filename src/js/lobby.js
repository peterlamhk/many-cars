(function() {
  'use strict';

  function Lobby() {
    this.titleTxt = null;
    this.startTxt = null;

    this.joinSprite = null;

    this.sessionTxt = null;

    this.rectWidth = 100;
    this.rectHeight = 50;

    this.padding = 5;
    this.max = 4;

    this.inputValue = [];
    this.count = 0;

    this.numberTxt = [];

    this.bg = null;
  }

  Lobby.prototype = {
    init: function(){
    },

    preload: function(){
    },

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2, i = 0;


      this.bg = this.add.sprite(x,y,'brown');
      this.bg.anchor.set(0.5);


      var graphics = this.game.add.graphics(0, 0);
      graphics.beginFill(0xFFFFFF, 1);
      graphics.drawRect(x-this.rectWidth/2, y-this.rectHeight*2.5, this.rectWidth, this.rectHeight);

      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Input Session Number:' );
      this.titleTxt.tint = 0x3F55DB;
      this.titleTxt.align = 'center';
      this.titleTxt.x = x - this.titleTxt.textWidth / 2;
      this.titleTxt.y = y - this.rectHeight - this.titleTxt.textHeight*4 - this.padding;

      // this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'Next' );
      // this.startTxt.align = 'center';
      // this.startTxt.x = x - this.startTxt.textWidth / 2;
      // this.startTxt.y = y + this.rectHeight + this.startTxt.height + this.padding*9;

      this.joinSprite = this.game.add.sprite(x,y,'join');
      this.joinSprite.anchor.set(0.5);
      this.joinSprite.scale.x = this.joinSprite.scale.y = 0.5;
      this.joinSprite.x = x;
      this.joinSprite.y = y + this.rectHeight*3;

      this.sessionTxt = this.add.bitmapText(x, y, 'minecraftia', '0000' );
      this.sessionTxt.align = 'center';
      this.sessionTxt.tint = 0x223344;;
      this.sessionTxt.x = x - this.sessionTxt.textWidth/2;
      this.sessionTxt.y = y - this.sessionTxt.textHeight*3;

      // Capture all key presses
      this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);

      // Initiate Event Listener
      this.joinSprite.inputEnabled = true;
      this.joinSprite.events.onInputDown.add(this.onDown, this);

      for (i = 0; i < 10;i++){
        this.numberTxt.push(this.add.bitmapText(x, y, 'minecraftia', ''+i ));
        this.numberTxt[i].tint = 0x3F55DB;
        this.numberTxt[i].align = 'center';
        this.numberTxt[i].x = this.game.width/2 - (i-5) * 70 - 60;
        // this.numberTxt[i].x = x - this.numberTxt[i].textWidth /2 - (i-5) *this.numberTxt[i].width*2.5 - this.numberTxt[i].width*1.8;
        this.numberTxt[i].y = y - this.rectHeight/3;
        this.numberTxt[i].scale.x = this.numberTxt[i].scale.y = 1.8;
        this.numberTxt[i].inputEnabled = true;
        var that = this;
        this.numberTxt[i].events.onInputDown.add(function(){
          var copy = i;
          return function() {
            that.numberDown(copy);
          }
          }(), this);
      }
    },

    numberDown: function(num){
      // console.log('1');
      // this.game.session = this.sessionToString();
      // this.game.state.start('control');
      var char = ''+num;
      this.keyPress(char);
    },

    update: function () {
      
    },

    onDown: function () {
      this.game.session = this.sessionToString();
      var that = this;
      var x = this.game.width / 2
        , y = this.game.height / 2;

      remote.registerRoom(this.game.session, function(playerId) {
        if( parseInt(playerId) > 0 ) {
          that.game.playerid = playerId;
          that.game.state.start('control');
        } else {
          that.titleTxt.setText(playerId);
          that.titleTxt.tint = 0xFF00000;
        }
      });
    },

    sessionToString: function () {
      var result = '';
      var i = 0;
      for (i = this.inputValue.length; i < this.max; i++){
        result += '0';
      }
      for (i = 0; i< this.inputValue.length; i++){
        result += this.inputValue[i];
      }
      return result;
    },

    keyPress: function(char) {
      var pattern = /[0-9]/;
      if (char.search(pattern) >= 0){
        if (this.count < this.max){
          this.inputValue[this.count] = char;
          this.count++;
        } else {
          this.inputValue.shift();
          this.inputValue.push(char);
        }
      } else {
        console.log(char);
      }
      this.sessionTxt.setText(this.sessionToString());
    }, 
  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Lobby = Lobby;

}());
