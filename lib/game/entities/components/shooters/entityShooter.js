ig.module(
    'game.entities.components.shooters.entityShooter'
)

.defines(function () {
    ig.EntityShooter = ig.Class.extend({
		controllingEntity: null,
		
		init: function(controllingEntity) {
            this.controllingEntity = controllingEntity;			
        },	
		
		spawnProjectile: function(projectileToSpawn) {
            var settings = [];
            // Let the projectile know which direction we are facing.
            settings['flip'] = this.controllingEntity.flip;
            // Let the projectile know who spawned it (this is done to prevent damaging self).
            // Once there are more entities and we setup the ig.Entity.TYPE properties, this may go away.
            settings['whoSpawned'] = this;

            var projectileOffset = this.determineProjectileOffset();
			
			ig.game.spawnEntity(projectileToSpawn, projectileOffset.x, projectileOffset.y, settings);            
        },
		
		determineProjectileOffset: function() {
            var projectileOffset = {x: 0, y: 0};

            projectileOffset.y = this.controllingEntity.pos.y + this.controllingEntity.size.y * 0.5;
            if (this.controllingEntity.flip) {
                projectileOffset.x = this.controllingEntity.pos.x - this.controllingEntity.size.x * 0.9;
            } else {
                projectileOffset.x = this.controllingEntity.pos.x + this.controllingEntity.size.x * 1.2;
            }

            return projectileOffset;
        }
	});
});