ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.system.camera',
    'game.levels.test'
    ,'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
    scale: 4,

    camera: null,
    player: null,

    gravity: 500,
	
	// Load a font
	font: new ig.Font( 'media/fonts/04b03.font.png' ),
	
	
	init: function() {
        this.setupCamera();
        this.bindKeys();
        this.loadLevel( LevelTest );
	},

    setupCamera: function() {
        this.camera = new Camera( ig.system.width / 2, ig.system.height / 3, 5 );
        this.camera.trap.size.x = ig.system.width / 15;
        this.camera.trap.size.y = ig.system.height / 3;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;
    },

    bindKeys: function() {
        ig.input.bind(ig.KEY.C, 'shoot');
        ig.input.bind(ig.KEY.G, 'grenade');
        ig.input.bind(ig.KEY.X, 'up');

        ig.input.bind(ig.KEY.A, 'left');
        ig.input.bind(ig.KEY.D, 'right');
        ig.input.bind(ig.KEY.W, 'up');
        ig.input.bind(ig.KEY.S, 'down');

        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
    },

    loadLevel: function( level ) {
        this.parent(level);

        this.player = this.getEntitiesByType(EntityPlayer)[0];

        // Set camera max and reposition trap
        this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

        this.camera.setEntityToFollow(this.player);
    },
	
	update: function() {
        this.camera.update();
		this.parent();
	},
	
	draw: function() {
		this.parent();
        this.camera.draw();
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
    ig.main('#canvas', MyGame, 60, 320, 240, 4);

    ig.system.resize(
        ig.global.innerWidth * 1 * (1 /  4),
        ig.global.innerHeight * 1 * (1 / 4),
        4
    );
}

});
