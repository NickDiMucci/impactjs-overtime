ig.module(
    'game.entities.player'
)

.requires(
    'game.system.eventChain'
)

.defines(function () {
    EntityPlayer = ig.Entity.extend({
        name: 'player',
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,

        animSheet: new ig.AnimationSheet('media/player/player.png', 16, 16),

        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        flip: false,

        maxVel: {x: 100, y: 300},
        friction: {x: 1000, y: 0},
        accelGround: 800,
        accelAir: 100,
        jump: 300,

        health: 100,
        isDead: false,

        deathEventChain: null,

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.1, [0, 1, 2, 3, 4, 5]);
            this.addAnim('jump', 1, [9]);
            this.addAnim('fall', 0.5, [6,7]);

            this.currentAnim = this.anims.idle;

            this.isDead = false;

            this.deathEventChain = EventChain(this)
                .then(function() {
                    this.isDead = true;
                    this.kill();
                })
                .repeat();
        },

        movePlayer: function() {
            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left')) {
                this.accel.x = -accel;
                //this.vel.x = -this.maxVel.x;
                this.flip = true;
                console.log('accel: x: ' + this.accel.x + ' y: ' + this.accel.y);
                console.log('vel: x: ' + this.vel.x + ' y: ' + this.vel.y);
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                //this.vel.x = this.maxVel.x;
                this.flip = false;
                console.log('accel: x: ' + this.accel.x + ' y: ' + this.accel.y);
                console.log('vel: x: ' + this.vel.x + ' y: ' + this.vel.y);
            } else {
                this.accel.x = 0;
            }

            if (this.standing) {
                if (ig.input.state('up')) {
                    this.vel.y = -this.jump;
                }
            }
        },

        stopMovingPlayer: function() {
            this.accel.x = 0;
            this.accel.y = 0;
        },

        selectAnimation: function() {
            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            } else if (this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            } else if (!this.isDead) {
                this.currentAnim = this.anims.idle;
            }
            this.currentAnim.flip.x = this.flip;
        },

        update: function() {
            this.movePlayer();
            this.selectAnimation();
            if (this.health <= 0) {
                this.deathEventChain();
            }
            this.parent();
        },

        check: function (other) {
        },
        // TODO: We may want to do distanceTo instead...
        collideWith: function (other) {
          if (other.name == 'enemy') {
              // Temporarily in god mode as I test some enemy respawning stuff.
              //this.health -= 10;
          }
        },

        handleMovementTrace: function(res) {
            // Continue resolving the collision as normal
            this.parent(res);
        },

        ready: function() {
        }
    });
});