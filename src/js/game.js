(function() {
  'use strict';

  function Car(index, game, material, x, y, angle) {
    this.color = [0xFFFF00, 0x0FF00, 0xFF0000, 0x0000FF];
    this.game = game;
    this.steeringAngle = angle;
    this.steeringMultiplier = 2;
    this.currentSpeed = 0;
    this.baseSpeed = 0;
    this.backwardSpeed = 0;
    this.skiddingSpeed = 0;
    this.drifting = false;
    this.reduceSpeed = false;

    this.car = game.add.sprite(x, y, 'cars');
    this.car.anchor.set(0.5);
    this.car.name = index;
    this.car.tint = this.color[index - 1];

    this.car.frame = angle/360*32+8;
    if (this.car.frame == 32) {
       this.car.frame = 0;
    }

    game.physics.p2.enable(this.car);
    this.car.body.setCircle(10);
    this.car.body.data.gravityScale = 0;
    this.car.body.damping = 0.01;
    this.car.body.fixedRotation = true;
    this.car.body.setMaterial(material);

    this.cursors = game.input.keyboard.createCursorKeys();

    // remote control touch status
    this.control = {};
    this.control.up = false;
    this.control.down = false;
    this.control.left = false;
    this.control.right = false;

    this.lap = 0;
    this.crossLine = false;
    this.finishTime = null;
    this.debug = false;
  }

  Car.prototype = {
    velocityFromAngle: function (angle, speed, point) {

      point = point || new Phaser.Point();

      point.x = Math.cos(this.game.math.degToRad(angle)) * speed;
      point.y = Math.sin(this.game.math.degToRad(angle)) * speed;

      return point;
    },
    update: function() {
      if (!this.finishTime) {
        if (this.debug) {
          this.control.up = this.cursors.up.isDown;
          this.control.down = this.cursors.down.isDown;
          this.control.left = this.cursors.left.isDown;
          this.control.right = this.cursors.right.isDown;
        }

        if (this.currentSpeed > 250) {
          this.baseSpeed = 0.25;
          this.steeringMultiplier = this.control.up ? 1 : 2;
        } else if (this.currentSpeed > 200) {
          this.baseSpeed = 0.5;
          this.steeringMultiplier = this.control.up ? 1.5 : 2;
        } else if (this.currentSpeed > 150) {
          this.baseSpeed = 0.75;
          this.steeringMultiplier = this.control.up ? 1.5 : 2;
        } else {
          this.baseSpeed = 1;
          this.steeringMultiplier = 2;
        }

        if (this.control.left) {
          if (this.currentSpeed >= 0) {
            this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
          } else if (this.currentSpeed < 0) {
            this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
          }
        } else if (this.control.right) {
          if (this.currentSpeed >= 0) {
            this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
          } else if (this.currentSpeed < 0) {
            this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
          }
        }

        if (this.control.left || this.control.right) {
          var angle = this.steeringAngle-270;
          if (angle < 0){
            angle += 360;
          }

          var frame = Math.floor(angle * (16*2) / 360);
          if (frame>16){
            this.car.scale.x = -1;
            frame = 16*2 - frame;
          } else {
            this.car.scale.x = 1;
            if (angle > 90 && frame === 16){
              frame=16;
            }
          }
          this.car.frame = frame;
        }

        if (this.control.up) {
          if (this.currentSpeed < 300) {
            this.currentSpeed += this.baseSpeed;
          }
          if (this.backwardSpeed < 0) {
            this.backwardSpeed += this.baseSpeed;
          }

          if (this.currentSpeed > 250 && this.skiddingSpeed < 100) {
            this.skiddingSpeed += 1;
          }

          if (this.drifting) {
            if (this.reduceSpeed) {
              this.currentSpeed *= 0.75;
              this.reduceSpeed = false;
            }

            if (this.currentSpeed >= 0) {
              this.velocityFromAngle(this.steeringAngle, this.currentSpeed, this.car.body.velocity);
            } else {
              this.velocityFromAngle(this.steeringAngle, this.backwardSpeed, this.car.body.velocity);
            }
          }
        } else if (this.control.down) {
          if (this.currentSpeed > -100) {
            this.currentSpeed -= 4;
          } else if (this.backwardSpeed > -100) {
            this.backwardSpeed -= 4;
          }
        } else {
          if (this.currentSpeed > 2) {
            this.currentSpeed -= 2;
            this.backwardSpeed -= 2;
          } else if (this.currentSpeed < -2) {
            this.currentSpeed += 2;
            this.backwardSpeed += 2;
          } else {
            this.currentSpeed = 0;
            this.backwardSpeed = 0;
          }
        }

        if (!this.control.up) {
          if (this.skiddingSpeed > 0) {
            this.skiddingSpeed -= 1;
          }

          if (this.drifting) {
            this.reduceSpeed = true;
          }
        }

        if (!this.skiddingSpeed) {
          if (this.currentSpeed >= 0) {
            this.velocityFromAngle(this.steeringAngle, this.currentSpeed, this.car.body.velocity);
          } else {
            this.velocityFromAngle(this.steeringAngle, this.backwardSpeed, this.car.body.velocity);
          }
          this.drifting = false;
        } else if (!this.drifting) {
          this.drifting = true;
        }


      } else {
        if (this.currentSpeed > 0) {
          this.currentSpeed -= 2;
        } else {
          this.currentSpeed = 0;
        }
        this.velocityFromAngle(this.steeringAngle, this.currentSpeed, this.car.body.velocity);
      }
    }
  }

  function Track(index, game, material) {
    var x = game.width / 2,
        y = game.height / 2;

    this.game = game;

    this.track = game.add.sprite(480, 270, index);
    this.track.name = index;
    this.game.physics.p2.enable(this.track);

    this.track.body.static = true;

    this.track.body.clearShapes();
    this.track.body.loadPolygon('physicsData', index);
  }

  Track.prototype = {

  }

  function CheckPoint(index, game, material, x, y, r) {
    this.game = game;

    var circleShape = new p2.Rectangle(r, r);
    circleShape.sensor = true;

    this.checkpoint = game.add.sprite(x, y, 'zero');
    this.checkpoint.name = index;
    game.physics.p2.enable(this.checkpoint, true);

    this.checkpoint.body.static = true;
    this.checkpoint.body.clearShapes();
    this.checkpoint.body.addShape(circleShape);
    this.checkpoint.body.setMaterial(material);
  }

  CheckPoint.prototype ={

  }

  function Game() {
    this.color = [0xFFFF00, 0x0FF00, 0xFF0000, 0x0000FF];
    this.cars = {};
    this.gameStarted = false;
    this.checkpoints = [];
    this.trackData = [{cp: [{x: 290, y: 490, r: 5}, {x: 878, y: 439, r: 5}, {x: 510, y: 54, r: 5}], start: {x: 225, y: 490}, angle: 0, rt: {x: 20, y: 0}},
      {cp: [{x: 642, y: 226, r: 5}, {x: 118, y: 97, r: 5}, {x: 182, y: 445, r: 5}], start: {x: 575, y: 225}, angle: 0, rt: {x: 514, y: 330}},
      {cp: [{x: 290, y: 488, r: 4.5}, {x: 745, y: 228, r: 5}, {x: 510, y: 45, r: 4}], start: {x: 225, y: 495}, angle: 0, rt: {x: 20, y: 0}} ];

    this.cpArray = [];
    this.totalLap = 1;
    this.countDownTimer = 30;
    this.gameOver = false;
    this.result = {};
  }

  Game.prototype = {
    startTimer: function() {
      this.readyText = this.add.bitmapText(0, 0, 'minecraftia', 'Ready' );
      this.readyText.align = 'center';
      this.readyText.x = this.game.width / 2;
      this.readyText.y = this.game.height / 2;
      this.readyText.anchor.set(0.5);

      var textArray = ['3', '2', '1', 'Go!', ''];
      for (var i = 0; i < textArray.length; i++) {
        this.game.time.events.add((i+1)*1000, function() {
          var text = textArray[i];
          return function() {
            this.readyText.setText(text);
          }
        }(), this);
      }

      this.game.time.events.add(4000, function() {
        this.timerText = this.add.bitmapText(0, 0, 'minecraftia', '00:00:00' );
        this.timerText.align = 'center';
        this.timerText.x = this.game.width - 100;
        this.timerText.y = 30;
        this.timerText.anchor.set(0.5);

        this.rankText = this.add.bitmapText(0, 0, 'minecraftia', '' );
        this.rankText.x = this.trackData[this.currentTrack].rt.x;
        this.rankText.y = this.trackData[this.currentTrack].rt.y;
        this.rankText.scale.set(0.75, 0.75);

        this.startTime = this.game.time.time;
        this.gameStarted = true;
      }, this);
    },
    updateRank: function() {
      if (this.gameStarted) {
        var that = this;
        var text = '';
        var stillRunning = false;
        Object.keys(this.cars).forEach(function(key) {
          if (that.cars[key].lap == that.totalLap) {
            if (!that.cars[key].finishTime) {
              var resultLength = Object.keys(that.result).length;
              that.result[resultLength+1] = {playerId: key, time: that.timerText.text};
              that.cars[key].finishTime = that.timerText.text;
              that.game.time.events.loop(Phaser.Timer.SECOND, that.updateCountDown, that);
            }
            text += 'P' + that.cars[key].car.name + ': ' + that.cars[key].finishTime + '\n';
          } else {
            text += 'P' + that.cars[key].car.name + ': ' + (parseInt(that.cars[key].lap) + 1) + '/' + that.totalLap + '\n';
            stillRunning = true;
          }
        });
        this.rankText.setText(text);

        if (!stillRunning || this.countDownTimer < 0) {
          this.readyText.setText('Game Over');

          this.game.time.events.add(5000, function() {

            Object.keys(this.cars).forEach(function(key) {
              if (!that.cars[key].finishTime) {
                var resultLength = Object.keys(that.result).length;
                that.result[resultLength+1] = {playerId: key, time: '-'};
              }
            });
            this.game.state.states['result'].result = this.result;
            this.game.state.start('result');
          }, this);
        }
      }
    },
    updateTimer: function() {
      if (this.gameStarted) {
        this.elapsedTime = this.game.time.elapsedSince(this.startTime);
        this.minutes = Math.floor(this.elapsedTime / 60000) % 60;

        this.seconds = Math.floor(this.elapsedTime / 1000) % 60;

        this.milliseconds = Math.floor(this.elapsedTime) % 100;

        if (this.milliseconds < 10)
          this.milliseconds = '0' + this.milliseconds;

        if (this.seconds < 10)
          this.seconds = '0' + this.seconds;

        if (this.minutes < 10)
          this.minutes = '0' + this.minutes;

        this.timerText.setText(this.minutes + ':'+ this.seconds + ':' + this.milliseconds);
      }
    },
    updateCountDown: function() {
      this.countDownTimer -= 1;
      this.readyText.setText(this.countDownTimer);
    },

    create: function() {
      var x = this.game.width / 2,
          y = this.game.height / 2;

      this.cars = {};
      this.gameStarted = false;
      this.checkpoints = [];
      this.cpArray = [];
      this.countDownTimer = 30;
      this.gameOver = false;
      this.result = {};

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.gravity.y = 0;
      this.game.physics.p2.gravity.x = 0;

      var carCollisionGroup = this.game.physics.p2.createCollisionGroup();
      var trackCollisionGroup = this.game.physics.p2.createCollisionGroup();
      var checkpointCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.game.physics.p2.updateBoundsCollisionGroup();


      var carMaterial = this.game.physics.p2.createMaterial('carMaterial');
      var trackMaterial = this.game.physics.p2.createMaterial('trackMaterial');
      var checkpointMaterial = this.game.physics.p2.createMaterial('checkpointMaterial');


      var contactMaterial = this.game.physics.p2.createContactMaterial(carMaterial, trackMaterial);
      contactMaterial.friction = 0.3;
      contactMaterial.restitution = 0.0;
      contactMaterial.stiffness = 1e7;
      contactMaterial.relaxation = 3;
      contactMaterial.frictionStiffness = 1e7;
      contactMaterial.frictionRelaxation = 3;
      contactMaterial.surfaceVelocity = 0;

      this.track = new Track(this.selectedTrack, this.game, trackMaterial);
      this.track.track.body.setCollisionGroup(trackCollisionGroup);
      this.track.track.body.collides([carCollisionGroup]);

      this.initline = this.game.add.sprite(this.trackData[this.currentTrack].start.x, this.trackData[this.currentTrack].start.y, 'initline');
      this.initline.anchor.set(0, 0.5);

      this.cp = this.trackData[this.currentTrack].cp;

      for (var i = 0; i < 3; i++) {
        this.checkpoints.push(new CheckPoint(i, this.game, checkpointMaterial, this.cp[i].x, this.cp[i].y, this.cp[i].r));
        this.checkpoints[i].checkpoint.body.setCollisionGroup(checkpointCollisionGroup);
        this.checkpoints[i].checkpoint.body.collides(carCollisionGroup);
      }

      for( var i = 1; i <= 4; i++ ) {
        if( viewer.latestPlayerList.indexOf(i) != -1 ) {
          this.cars[i] = new Car(i, this.game, carMaterial, this.trackData[this.currentTrack].start.x, this.trackData[this.currentTrack].start.y, this.trackData[this.currentTrack].angle);

          this.cars[i].car.body.setCollisionGroup(carCollisionGroup);
          this.cars[i].car.body.collides([carCollisionGroup, trackCollisionGroup, checkpointCollisionGroup]);

          this.cars[i].car.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
            var idx = i;
            return function(body, shapeA, shapeB, equation) {
              if (body.sprite.name != this.track.name) {
                var cpLength = this.cpArray.length;
                if (cpLength == 3) {
                  this.cpArray = [];

                  this.cars[idx].crossLine = true;
                }

                this.cpArray.push(body.sprite.name);

                if (cpLength == this.cpArray[cpLength]) {
                  if (this.cars[idx].crossLine) {
                    this.cars[idx].lap += 1
                    this.cars[idx].crossLine = false;
                  }
                } else {
                  this.cpArray.pop();
                }
              }
            }
          }(), this);
        }
      }

      // set listener to update remote control
      var that = this;
      viewer.initPlayerMoveListener(function(playerId, moves) {
        that.cars[playerId].control = moves;
      });

      this.startTimer();
    },

    update: function() {
      // console.log(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
      var that = this;
      if (this.gameStarted) {
        Object.keys(this.cars).forEach(function(key) {
          that.cars[key].update();
        });
        this.updateCarLocations();
        this.updateTimer();
        this.updateRank();
      }
    },

    updateCarLocations: function() {
      var data = {}, that = this;

      Object.keys(this.cars).forEach(function(key) {
        data[key] = {
          x: that.cars[key].car.x,
          y: that.cars[key].car.y
        };
      });

      viewer.updateMobileDisplay(data);
    },

    onInputDown: function() {
      this.game.state.start('menu');
    }

  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Game = Game;

}());
