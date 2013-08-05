ig.module(
    'game.entities.components.controllers.playerController'
)

.requires(
    'game.entities.components.controllers.entityController'
)

.defines(function () {
    PlayerController = ig.EntityController.extend({
		gamepad: null,
		
		init: function(controllingEntity, gamepad) {
            this.parent(controllingEntity);
			this.gamepad = gamepad;
        },
		
		move: function() {
			if (ig.input.state('left') || this.gamepad.pad.dpadLeft == 1) {
                this.moveLeft();
            } else if (ig.input.state('right') || this.gamepad.pad.dpadRight == 1) {
                this.moveRight();
            } else {
                this.stand();
            }
            
			if (ig.input.pressed('up') || this.gamepad.buttonReleased(this.gamepad.prevGamepadState.faceButton0, this.gamepad.pad.faceButton0)) {
				this.jump();
            }
		},

        update: function() {
			this.parent();
			this.move();
        }
	});
});