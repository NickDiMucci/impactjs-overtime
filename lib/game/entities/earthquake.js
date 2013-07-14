/*
 This entity shakes the screen when its triggeredBy() method is called - usually
 through an EntityTrigger entity.

 Keys for Weltmeister:

 strength
 max amount of screen movement in pixels
 default: 8

 duration
 duration of the screen shaking in seconds
 default: 1

 Original author: Dominic Szablewski
 Modified by: Nicholas DiMucci
 */
ig.module(
    'game.entities.earthquake'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityEarthquake = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(80, 130, 170, 0.7)',

        size: {x: 8, y: 8},

        duration: 1,
        strength: 8,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },

        triggeredBy: function( entity, trigger ) {
            // Unlike dominic's example, I'm handling the shaking effect within the camera class.
            // This allows us to create shaking effects within code as well, and not just with Weltmeister triggers.
            ig.game.camera.setShake(this.strength, this.duration);
        },

        update: function() {
        }
    });
});
