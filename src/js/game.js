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

  function Game() {
    this.cars = [];
    this.numOfPlayer = 4;
  }

  Game.prototype = {
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
      this.game.physics.p2.updateBoundsCollisionGroup();


      var carMaterial = this.game.physics.p2.createMaterial('carMaterial');
      var trackMaterial = this.game.physics.p2.createMaterial('trackMaterial');


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

      for (var i = 0; i < this.numOfPlayer; i++) {
        this.cars.push(new Car(i, this.game, carMaterial));

        this.cars[i].car.body.setCollisionGroup(carCollisionGroup);
        this.cars[i].car.body.collides([carCollisionGroup, trackCollisionGroup]);
      }

      // this.cursors = this.game.input.keyboard.createCursorKeys();
      this.game.input.onDown.add(this.click, this);
    },

    update: function() {
      for (var i = 0; i < this.numOfPlayer; i++) {
        this.cars[i].update();
      }
    },

    onInputDown: function() {
      this.game.state.start('menu');
    }

  };

  window['drift-runners'] = window['drift-runners'] || {};
  window['drift-runners'].Game = Game;

}());
