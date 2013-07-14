/*
 Camera class that follows a particular entity using a trap based system,
 as described by Shaun Inman at http://blog.mimeoverse.com/post/581467761/the-ideal-platformer-camera-should-minimize.

 This camera class also features the ability to shake the screen given specific strength & duration factors.

 Original author: Dominic Szablewski
 Modified by: Nicholas DiMucci
 */
ig.module(
    'game.system.camera'
)

.defines(function () {
    Camera = ig.Class.extend({
        entityToFollow: null,

        trap: {
            pos: { x: 0, y: 0},
            size: { x: 16, y: 16 }
        },
        max: { x: 0, y: 0 },
        offset: {x: 0, y:0},
        pos: {x: 0, y: 0},
        damping: 5,
        lookAhead: { x: 0, y: 0},
        currentLookAhead: { x: 0, y: 0},

        debug: false,

        timer: null,
        shake: false,
        strength: 0,

        init: function( offsetX, offsetY, damping ) {
            this.offset.x = offsetX;
            this.offset.y = offsetY;
            this.damping = damping;
            this.timer = new ig.Timer();
        },

        setEntityToFollow: function( entity ) {
            this.entityToFollow = entity;

            this.pos.x = this.entityToFollow.pos.x - this.offset.x;
            this.pos.y = this.entityToFollow.pos.y - this.offset.y;

            this.trap.pos.x = this.entityToFollow.pos.x - this.trap.size.x / 2;
            this.trap.pos.y = this.entityToFollow.pos.y - this.trap.size.y;
        },

        setShake: function(strength, duration) {
            this.timer.set(duration || 1);
            this.strength = strength || 8;
            this.shake = true;
        },

        updateShake: function() {
            var screen = ig.game.screen;
            if (this.timer.delta() < 0) {
                // Subtract from the current screen position by a random (x, y) value between -strength & strength,
                // multiplying by timer.delta to decrease the intensity over time.
                screen.x -= Math.random().map(0, 1, -this.strength, this.strength) * this.timer.delta();
                screen.y -= Math.random().map(0, 1, -this.strength, this.strength) * this.timer.delta();
            } else {
                this.shake = false;
            }
        },

        follow: function( entity ) {
            this.pos.x = this.move( 'x', entity.pos.x, entity.size.x );
            this.pos.y = this.move( 'y', entity.pos.y, entity.size.y );
            // If we are going to shake, be sure to set the screen to the current position BEFORE shaking.
            ig.game.screen.x = this.pos.x;
            ig.game.screen.y = this.pos.y;

            if (this.shake) {
                this.updateShake();
            }
        },


        move: function( axis, pos, size ) {
            var lookAhead = 0;
            if( pos < this.trap.pos[axis] ) {
                this.trap.pos[axis] = pos;
                this.currentLookAhead[axis] = this.lookAhead[axis];
            }
            else if( pos + size > this.trap.pos[axis] + this.trap.size[axis] ) {
                this.trap.pos[axis] = pos + size - this.trap.size[axis];
                this.currentLookAhead[axis] = -this.lookAhead[axis];
            }

            return (
                this.pos[axis] - (
                    this.pos[axis] - this.trap.pos[axis] + this.offset[axis]
                        + this.currentLookAhead[axis]
                    ) * ig.system.tick * this.damping
                ).limit( 0, this.max[axis] );
        },

        update: function() {
            this.follow(this.entityToFollow);
        },

        draw: function() {
            if( this.debug ) {
                ig.system.context.fillStyle = 'rgba(255,0,255,0.3)';
                ig.system.context.fillRect(
                    (this.trap.pos.x - this.pos.x) * ig.system.scale,
                    (this.trap.pos.y - this.pos.y) * ig.system.scale,
                    this.trap.size.x * ig.system.scale,
                    this.trap.size.y * ig.system.scale
                );
            }
        }
    });
});