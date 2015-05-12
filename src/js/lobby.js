(function() {
  'use strict';

  function Lobby() {
    this.titleTxt = null;
    this.startTxt = null;

    this.sessionTxt = null;

    this.rectWidth = 100;
    this.rectHeight = 50;

    this.padding = 5;
    this.max = 4;

    this.inputValue = [];
    this.count = 0;

    this.numberTxt = [];
  }

  Lobby.prototype = {
    init: function(){
    },

    preload: function(){
    },

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2, i = 0;

      var graphics = this.game.add.graphics(0, 0);
      graphics.beginFill(0xFFFFFF, 1);
      graphics.drawRect(x-this.rectWidth/2, y-this.rectHeight/2, this.rectWidth, this.rectHeight);

      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Input Session Number:' );
      this.titleTxt.align = 'center';
      this.titleTxt.x = x - this.titleTxt.textWidth / 2;
      this.titleTxt.y = y - this.rectHeight - this.titleTxt.textHeight - this.padding;

      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'Next' );
      this.startTxt.align = 'center';
      this.startTxt.x = x - this.startTxt.textWidth / 2;
      this.startTxt.y = y + this.rectHeight + this.startTxt.height + this.padding*9;

      this.sessionTxt = this.add.bitmapText(x, y, 'minecraftia', '0000' );
      this.sessionTxt.align = 'center';
      this.sessionTxt.tint = 0x223344;;
      this.sessionTxt.x = x - this.sessionTxt.textWidth/2;
      this.sessionTxt.y = y - this.sessionTxt.textHeight/2;

      // Capture all key presses
      this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);

      // Initiate Event Listener
      this.startTxt.inputEnabled = true;
      this.startTxt.events.onInputDown.add(this.onDown, this);

      for (i = 0; i < 10;i++){
        this.numberTxt.push(this.add.bitmapText(x, y, 'minecraftia', ''+i ));
        this.numberTxt[i].align = 'center';
        this.numberTxt[i].x = x - this.numberTxt[i].textWidth /2 - (i-5) *this.numberTxt[i].width*2.5 - this.numberTxt[i].width*1.8;
        this.numberTxt[i].y = y + this.rectHeight/1.5;
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
      this.game.state.start('control');
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
