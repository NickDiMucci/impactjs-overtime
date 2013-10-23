ig.module(
    'game.entities.components.gamepadControllable'
)

.requires(
    'plugins.gamepad'
)

.defines(function () {
    GamepadControllable = ig.Class.extend({
        pad: null,
        prevGamepadState: null,

        init: function() {
            this.pad = Gamepad.getState(0);
            if (this.pad == undefined) {
                this.pad = 0;
            }
            // Obtain previous gamepad state so we can properly perform "on button release" actions.
            this.prevGamepadState = Gamepad.getPreviousState(0);
            if (this.prevGamepadState == undefined) {
                this.prevGamepadState = 0;
            }
        },

        buttonReleased: function(prevGamePadStateButton, currGamePadStateButton) {
            return prevGamePadStateButton == 0 && currGamePadStateButton == 1;
        },

        update: function() {
            this.pad = Gamepad.getState(0);
            if (this.pad == undefined) {
                this.pad = 0;
            }
            // Obtain previous gamepad state so we can properly perform "on button release" actions.
            this.prevGamepadState = Gamepad.getPreviousState(0);
            if (this.prevGamepadState == undefined) {
                this.prevGamepadState = 0;
            }
            // According to Gamepad plugin author, this is necessary.
            //this.prevGamepadState = undefined;
            //this.pad = undefined;
        }
    });
});
