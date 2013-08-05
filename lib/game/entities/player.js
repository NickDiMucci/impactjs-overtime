ig.module(
    'game.entities.player'
)

.requires(
    'game.system.eventChain',
    'game.entities.components.controllers.playerController',
    'game.entities.components.shooters.playerShooter',
    'game.entities.components.gamepadControllable'
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

        components: null,
        playerController: null,
        playerShooter: null,
        gamepad: null,

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
                })
                .repeat();
            this.components = [];
            this.gamepad = new GamepadControllable();
            this.components.push(this.gamepad);
            this.playerController = new PlayerController(this, this.gamepad);
            this.components.push(this.playerController);
            this.playerShooter = new PlayerShooter(this, this.gamepad);
            this.components.push(this.playerShooter);
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
            for (var i = 0; i < this.components.length; ++i) {
                this.components[i].update();
            }
            this.selectAnimation();
            this.parent();
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
        },

        kill: function() {
            this.deathEventChain();
            this.parent();
        }
    });
});