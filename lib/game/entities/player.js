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
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            if (this.standing) {
                if (ig.input.pressed('up')) {
                    this.vel.y = -this.jump;
                }
            }
        },

        shoot: function() {
            var settings = [];
            // Let the projectile know which direction we are facing.
            settings['flip'] = this.flip;
            // Let the projectile know who spawned it (this is done to prevent damaging self).
            // Once there are more entities and we setup the ig.Entity.TYPE properties, this may go away.
            settings['whoSpawned'] = this;

            var projectileOffset = this.determineProjectileOffset();

            if (ig.input.released('shoot')) {
                ig.game.spawnEntity(EntityBullet, projectileOffset.x, projectileOffset.y, settings);
            } else if (ig.input.released('grenade')) {
                ig.game.spawnEntity(EntityGrenade, projectileOffset.x, projectileOffset.y, settings);
            }
        },

        determineProjectileOffset: function() {
            var projectileOffset = {x: 0, y: 0};

            projectileOffset.y = this.pos.y + this.size.y * 0.5;
            if (this.flip) {
                projectileOffset.x = this.pos.x - this.size.x * 0.3;
            } else {
                projectileOffset.x = this.pos.x + this.size.x * 0.7;
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
        },

        check: function (other) {
        },

        collideWith: function (other) {
          if (other.name == 'enemy') {
              // Temporarily in god mode as I test some enemy respawning stuff.
              //this.health -= 10;
          }
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