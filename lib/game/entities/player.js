ig.module(
    'game.entities.player'
)

.requires(
    'game.system.eventChain',
    'game.entities.weapons.ammo.bullet',
    'game.entities.weapons.ammo.grenade'
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
        accelAir: 300,
        jump: 500,

        health: 100,
        isDead: false,

        deathEventChain: null,
        pad: null,

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

        movePlayer: function () {
            var prevGamepadState = Gamepad.getPreviousState(0);
            if (prevGamepadState == undefined) {
                prevGamepadState = 0;
            }

            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left') || this.pad.dpadLeft == 1) {
                this.accel.x = -accel;
                this.flip = true;
            } else if (ig.input.state('right') || this.pad.dpadRight == 1) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            if (this.standing) {
                if (ig.input.pressed('up') || (prevGamepadState.faceButton0 == 0 && this.pad.faceButton0 == 1)) {
                    this.vel.y = -this.jump;
                }
            }
        },

        shoot: function () {
            var prevGamepadState = Gamepad.getPreviousState(0);
            if (prevGamepadState == undefined) {
                prevGamepadState = 0;
            }

            var settings = [];
            // Let the projectile know which direction we are facing.
            settings['flip'] = this.flip;
            // Let the projectile know who spawned it (this is done to prevent damaging self).
            // Once there are more entities and we setup the ig.Entity.TYPE properties, this may go away.
            settings['whoSpawned'] = this;

            var projectileOffset = this.determineProjectileOffset();

            if (ig.input.released('shoot') || (prevGamepadState.faceButton2 == 0 && this.pad.faceButton2 == 1)) {
                ig.game.spawnEntity(EntityBullet, projectileOffset.x, projectileOffset.y, settings);
            } else if (ig.input.released('grenade') || (prevGamepadState.faceButton1 == 0 && this.pad.faceButton1 == 1)) {
                ig.game.spawnEntity(EntityGrenade, projectileOffset.x, projectileOffset.y, settings);
            }
        },

        determineProjectileOffset: function() {
            var projectileOffset = {x: 0, y: 0};

            projectileOffset.y = this.pos.y + this.size.y * 0.5;
            if (this.flip) {
                projectileOffset.x = this.pos.x - this.size.x * 0.9;
            } else {
                projectileOffset.x = this.pos.x + this.size.x * 1.2;
            }

            return projectileOffset;
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
            this.pad = Gamepad.getState(0);
            if (this.pad == undefined) {
                this.pad = 0;
            }

            this.movePlayer();
            this.shoot();
            this.selectAnimation();
            if (this.health <= 0) {
                this.deathEventChain();
            }
            if (this.isDead) {
                this.stopMovingPlayer();
            }
            this.parent();
            this.pad = undefined;
        },

        collideWith: function (other, axis) {
            this.parent(other, axis);
        },

        receiveDamage: function(amount, from) {
            console.log("Receiving damage!");
            this.parent(amount, from);
        },

        handleMovementTrace: function(res) {
            // Continue resolving the collision as normal
            this.parent(res);
        },

        ready: function() {
            this.isDead = false;
        }
    });
});