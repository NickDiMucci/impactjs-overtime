ig.module(
    'game.entities.components.shooters.playerShooter'
)

.requires(
    'game.entities.components.shooters.entityShooter',
    'game.entities.weapons.ammo.bullet',
    'game.entities.weapons.ammo.grenade'
)

.defines(function () {
    PlayerShooter = ig.EntityShooter.extend({
        gamepad: null,

        init: function(controllingEntity, gamepad) {
            this.parent(controllingEntity);
            this.gamepad = gamepad;
        },

        shoot: function() {
            if (ig.input.released('shoot') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton2, this.gamepad.pad.faceButton2)) {
                this.spawnProjectile(EntityBullet);
            } else if (ig.input.released('grenade') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton1, this.gamepad.pad.faceButton1)) {
                this.spawnProjectile(EntityGrenade);
            }
        },

        update: function() {
            this.shoot();
        }
    });
});
