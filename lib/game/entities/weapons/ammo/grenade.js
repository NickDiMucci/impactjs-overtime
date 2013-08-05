ig.module(
    'game.entities.weapons.ammo.grenade'
)

.requires(
    'game.entities.abstract.projectile'
)

.defines(function() {
    EntityGrenade = EntityProjectile.extend({
        collides: ig.Entity.COLLIDES.ACTIVE,
        maxVel: {x: 125, y: 125},
        startingYVeloctiy: -100,
        bounciness: 0.6,
        gravityFactor: 1,

        size: {x: 4, y: 4},
        offset: {x: 2, y: 3},

        damageAmount: 15,
        decayTime: 1,

        animSheet: new ig.AnimationSheet('media/slime-grenade.png', 8, 8),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('shot', 0.2, [0, 1]);
            this.currentAnim = this.anims.shot;
            this.currentAnim.flip.x = settings['flip'];

            this.vel.x = (settings['flip'] ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = this.startingYVeloctiy;
        },

        collideWith: function(other, axis) {
            // TODO: explode!
            this.kill();
            this.parent(other, axis);
        }
    });
});