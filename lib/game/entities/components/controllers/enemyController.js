ig.module(
    'game.entities.components.controllers.enemyController'
)

.requires(
    'game.entities.components.controllers.entityController'
)

.defines(function () {
    EnemyController = ig.EntityController.extend({
        controllingEntity: null,
        accel: null,
        ai: null,

        init: function(controllingEntity) {
            this.controllingEntity = controllingEntity;
        },

        setAi: function(ai) {
            this.ai = ai;
        },

        update: function() {
            this.parent();
            if (this.ai) {
                this.ai();
            }
        }
    });
});