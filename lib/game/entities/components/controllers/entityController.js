ig.module(
    'game.entities.components.controllers.entityController'
)

.defines(function () {
    ig.EntityController = ig.Class.extend({
        controllingEntity: null,
        accel: null,

        init: function(controllingEntity) {
            this.controllingEntity = controllingEntity;
        },

        moveLeft: function() {
            this.controllingEntity.accel.x = -this.accel;
            this.controllingEntity.flip = true;
        },

        moveRight: function() {
            this.controllingEntity.accel.x = this.accel;
            this.controllingEntity.flip = false;
        },

        stand: function() {
            this.controllingEntity.accel.x = 0;
        },

        jump: function() {
            if (this.controllingEntity.standing) {
                this.controllingEntity.vel.y = -this.controllingEntity.jump;
            }
        },

        stopMoving: function() {
            // Set accel to 0, over vel, to gradually stop the entity.
            this.controllingEntity.accel.x = 0;
            this.controllingEntity.accel.y = 0;
        },

        update: function() {
            this.accel = this.controllingEntity.standing ? this.controllingEntity.accelGround : this.controllingEntity.accelAir;
        }
    });
});
