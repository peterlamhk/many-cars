(function() {
  'use strict';

  function Car(index, game, material) {
    var x = game.width / 2,
        y = game.height / 2;

    this.game = game;
    this.steeringAngle = 270;
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

    this.car.frame = 0;

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
  }

  Car.prototype = {
    velocityFromAngle: function (angle, speed, point) {

      point = point || new Phaser.Point();

      point.x = Math.cos(this.game.math.degToRad(angle)) * speed;
      point.y = Math.sin(this.game.math.degToRad(angle)) * speed;

      return point;
    },
    update: function() {
      if (this.currentSpeed > 250) {
        this.baseSpeed = 0.25;
        this.steeringMultiplier = this.cursors.up.isDown ? 1 : 2;
      } else if (this.currentSpeed > 200) {
        this.baseSpeed = 0.5;
        this.steeringMultiplier = this.cursors.up.isDown ? 1.5 : 2;
      } else if (this.currentSpeed > 150) {
        this.baseSpeed = 0.75;
        this.steeringMultiplier = this.cursors.up.isDown ? 1.5 : 2;
      } else {
        this.baseSpeed = 1;
        this.steeringMultiplier = 2;
      }

      if (this.cursors.left.isDown) {
        if (this.currentSpeed > 0) {
          this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
        } else if (this.currentSpeed < 0) {
          this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
        }
      } else if (this.cursors.right.isDown) {
        if (this.currentSpeed > 0) {
          this.steeringAngle = this.steeringAngle < 359 ? this.steeringAngle + this.steeringMultiplier : 0;
        } else if (this.currentSpeed < 0) {
          this.steeringAngle = this.steeringAngle > 0 ? this.steeringAngle - this.steeringMultiplier : 359;
        }
      }

      if (this.cursors.left.isDown || this.cursors.right.isDown) {
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

      if (this.cursors.up.isDown) {
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
      } else if (this.cursors.down.isDown) {
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

      if (!this.cursors.up.isDown) {
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

    var circleShape = new p2.Circle(r);
    circleShape.sensor = true;

    this.name = index;
    this.body = game.physics.p2.createBody(x, y, 0, true);
    this.body.debug = true;
    this.body.clearShapes();
    this.body.addShape(circleShape);
    this.body.setMaterial(material);
  }

  CheckPoint.prototype ={

  }

  function Game() {
    this.cars = {};
    this.gameStarted = false;
    this.checkpoints = [];
    this.cp = [{x: 274, y: 490, r: 2}, {x: 878, y: 439, r: 2}, {x: 510, y: 54, r: 2}];
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

        this.startTime = this.game.time.time;
        this.gameStarted = true;
      }, this);
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
    hitTrack: function(body1, body2) {
      // this.currentSpeed -= 50;
    },

    click: function(pointer) {
      var result;
      var bodies = this.game.physics.p2.hitTest(pointer.position, [ this.track1aL, this.track1aR, this.track1bL, this.track1bR ]);

      if (bodies.length === 0) {
        result = "You didn't click a Body";
      } else {
        result = "You clicked: ";
        for (var i = 0; i < bodies.length; i++) {
          result = result + bodies[i].parent.sprite.key;

          if (i < bodies.length - 1) {
              result = result + ', ';
            }
        }
      }
      console.log(result);
    },

    create: function() {
      var x = this.game.width / 2,
          y = this.game.height / 2;

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

      this.track1 = new Track('track1', this.game, trackMaterial);
      this.track1.track.body.setCollisionGroup(trackCollisionGroup);
      this.track1.track.body.collides(carCollisionGroup, this.hitTrack, this);

      for( var i = 1; i <= 4; i++ ) {
        if( viewer.latestPlayerList.indexOf(i) != -1 ) {
          this.cars[i] = new Car(i, this.game, carMaterial);

          this.cars[i].car.body.setCollisionGroup(carCollisionGroup);
          this.cars[i].car.body.collides([carCollisionGroup, trackCollisionGroup, checkpointCollisionGroup]);
        }
      }

      for (var i = 0; i < 3; i++) {
        this.checkpoints.push(new CheckPoint(0, this.game, checkpointMaterial, this.cp[i].x, this.cp[i].y, this.cp[i].r));
        this.checkpoints[i].body.setCollisionGroup(checkpointCollisionGroup);
        this.checkpoints[i].body.collides(carCollisionGroup);
        this.checkpoints[i].body.onBeginContact.add(function() {
          console.log('onBeginContact');
        }, this);

      }

      // this.cursors = this.game.input.keyboard.createCursorKeys();
      this.game.input.onDown.add(this.click, this);

      // set listener to update remote control
      var that = this;
      viewer.initPlayerMoveListener(function(playerId, moves) {
        that.cars[playerId].control = moves;
      });

      this.startTimer();
    },

    update: function() {
      var that = this;
      Object.keys(this.cars).forEach(function(key) {
        that.cars[key].update();
      });
      this.updateCarLocations();
      this.updateTimer();
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
