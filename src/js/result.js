(function () {
  'use strict';

  function Result() {
    this.titleTxt = null;
    this.restartTxt = null;
    this.orderTitle = null;
    this.playerTitle = null;
    this.timeTitle = null;
    this.playerTxt = [];
    this.selectedTrack = null;

    this.maxPlayer = 4;
    this.color = [0xfff000, 0x00ff00, 0xff4e8d, 0x8a00ff];
  }

  Result.prototype = {
    preload: function() {},

    create: function() {
        var that = this;

        var sampleData = {
            1: {playerId: 2, time: '00:11:22'},
            2: {playerId: 3, time: '00:14:11'},
            3: {playerId: 1, time: '00:16:33'},
            4: {playerId: 4, time: '-'}
        };

        var gameResult = sampleData;

        // draw result page title
        this.titleTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Result');
        this.titleTxt.align = 'left';
        this.titleTxt.tint = 0x66CCFF;
        this.titleTxt.x = this.titleTxt.textWidth / 2;
        this.titleTxt.y = this.titleTxt.textHeight / 2;

        // draw restart text (click to load Room)
        this.restartTxt = this.add.bitmapText(0, 0, 'minecraftia', 'Restart game');
        this.restartTxt.align = 'right';
        this.restartTxt.x = this.game.width - this.restartTxt.textWidth;
        this.restartTxt.y = this.game.height - this.restartTxt.textHeight;

        this.restartTxt.inputEnabled = true;
        this.restartTxt.events.onInputDown.add(function() {
            that.game.state.start('room');
        }, this);

        // draw result table title, i.e. #, player, time
        var tableTitleY = this.titleTxt.y + 60;
        this.orderTitle = this.add.bitmapText(0, 0, 'minecraftia', '#');
        this.orderTitle.align = 'left';
        this.orderTitle.tint = 0xFF9966;
        this.orderTitle.x = this.titleTxt.x + 40;
        this.orderTitle.y = tableTitleY;

        this.playerTitle = this.add.bitmapText(0, 0, 'minecraftia', 'Player');
        this.playerTitle.align = 'left';
        this.playerTitle.tint = 0xFF9966;
        this.playerTitle.x = this.orderTitle.x + 100;
        this.playerTitle.y = tableTitleY;

        this.timeTitle = this.add.bitmapText(0, 0, 'minecraftia', 'Time');
        this.timeTitle.align = 'left';
        this.timeTitle.tint = 0xFF9966;
        this.timeTitle.x = this.playerTitle.x + 300;
        this.timeTitle.y = tableTitleY;

        // draw result table content
        Object.keys(gameResult).forEach(function(key) {
            var playerRecord = {};
            var currentY = tableTitleY + 60 * key;

            playerRecord.rank = that.add.bitmapText(0, 0, 'minecraftia', key);
            playerRecord.rank.align = 'left';
            playerRecord.rank.tint = that.color[key-1];
            playerRecord.rank.x = that.orderTitle.x;
            playerRecord.rank.y = currentY

            playerRecord.player = that.add.bitmapText(0, 0, 'minecraftia', 'Player ' + gameResult[key].playerId);
            playerRecord.player.align = 'left';
            playerRecord.player.tint = that.color[key-1];
            playerRecord.player.x = that.playerTitle.x;
            playerRecord.player.y = currentY;

            playerRecord.time = that.add.bitmapText(0, 0, 'minecraftia', gameResult[key].time);
            playerRecord.time.align = 'left';
            playerRecord.time.tint = that.color[key-1];
            playerRecord.time.x = that.timeTitle.x;
            playerRecord.time.y = currentY;

            that.playerTxt[key] = playerRecord;
        });
    }


  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Result = Result;
}());
