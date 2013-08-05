ig.module(
    'game.entities.spike'
)

.requires(
    'game.system.eventChain',
    'game.entities.components.controllers.enemyController',
    'game.entities.components.controllers.entityController',
    'game.entities.components.shooters.entityShooter'
)

.defines(function () {
    EntitySpike = ig.Entity.extend({
        name: 'spike',
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        animSheet: new ig.AnimationSheet('media/spike.png', 16, 9),
        size: {x: 15, y: 7},
        offset: {x: 1, y: 2},
        flip: false,

        maxVel: {x: 50, y: 300},
        friction: {x: 1000, y: 0},
        accelGround: 25,
        accelAir: 25,

        health: 50,
        isDead: false,
        deathEventChain: null,

        components: null,
        enemyController: null,
        enemyShooter: null,
        ai: null,

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0]);
            this.addAnim('run', 0.1, [0, 1, 2]);

            this.currentAnim = this.anims.idle;

            this.isDead = false;

            this.deathEventChain = EventChain(this)
                .then(function() {
                    this.isDead = true;
                })
                .repeat();

            this.components = [];

            this.enemyController = new EnemyController(this);
            this.ai = EventChain(this.enemyController)
                .then(function() {
                    this.moveLeft();
                })
                .wait(Math.random() * (5 - 2) + 2)
                .then(function() {
                    this.moveRight();
                })
                .wait(Math.random() * (5 - 2) + 2)
                .then(function() {
                    this.stand()
                })
                .wait(Math.random() * (5 - 2) + 2)
                .repeat();
            this.enemyController.setAi(this.ai);
            this.components.push(this.enemyController);
//            this.entityShooter = new EntityShooter(this);
//            this.components.push(this.entityShooter);
        },

        selectAnimation: function() {
            if (this.vel.x != 0) {
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

        receiveDamage: function(amount, from) {
            console.log(this.name + " is receiving damage!");
            this.parent(amount, from);
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