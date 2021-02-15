export default ({ simulator }) => {
	return {
		create({ entity }) {
			/* self, raw */
			if (entity.nid === simulator.myRawId) {
				// this is *OUR* entity, enable collisions for it
				// we'll be using thes ein clientside prediction
				entity.mesh.checkCollisions = true
				simulator.myRawEntity = entity
			}

			/* self, smooth */
			if (entity.nid === simulator.mySmoothId) {
				// this is also *OUR* entity as seen by others.. but this client should just hide it
				entity.mesh.checkCollisions = false
				simulator.mySmoothEntity = entity
				entity.mesh.setEnabled(false) // hide it
			}
		},
		delete({ nid, entity }) {
			entity.mesh.dispose()
		},
		watch: {
			hitpoints({ entity, value }) {
				// this doesnt happen ever.. but this is an example hook 
				console.log('hitpoints changed! time to update our ui or something')
			}
		}
	}
}
