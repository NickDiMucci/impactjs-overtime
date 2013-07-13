ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.test'
    ,'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
    gravity: 300,
	
	// Load a font
	font: new ig.Font( 'media/fonts/04b03.font.png' ),
	
	
	init: function() {
        this.bindKeys();
        this.loadLevel( LevelTest );
	},

    bindKeys: function() {
        ig.input.bind(ig.KEY.MOUSE1, 'leftClick');

        ig.input.bind(ig.KEY.A, 'left');
        ig.input.bind(ig.KEY.D, 'right');
        ig.input.bind(ig.KEY.W, 'up');
        ig.input.bind(ig.KEY.S, 'down');

        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
    },
	
	update: function() {
        // screen follows the player
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) {
            this.screen.x = player.pos.x - ig.system.width/2;
            this.screen.y = player.pos.y - ig.system.height/2;
        }

		this.parent();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


if( ig.ua.iPad ) {
    ig.Sound.enabled = false;
    ig.main('#canvas', MyGame, 60, 240, 160, 2);
}
else if( ig.ua.mobile ) {
    ig.Sound.enabled = false;
    ig.main('#canvas', MyGame, 60, 160, 160, 2);
}
else {
    ig.main('#canvas', MyGame, 60, 320, 240, 3);
}

});
