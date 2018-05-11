Assert = require('Assert')

function Mine(game, memory, source) {
    var id = memory.sources[source.id].mineId
    if (id === undefined) {
        id = 'Mine' + memory.nextId++
        memory.sources[source.id] = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id,
            sourceId: source.id,
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.source = source
    const p = source.pos
    const terrain = this.source.room.lookForAtArea(LOOK_TERRAIN, p.y - 1, p.x - 1, p.y + 1, p.x + 1, true)
    const found = terrain.find(pos => pos.terrain == 'plain')
    this.position = this.source.room.getPositionAt(found.x, found.y)
}

Mine.prototype.allocateCreeps = function(allocator) {
    allocator.allocateFixed(this, 'miner', 1)
}

Mine.prototype.execute = function() {
    this.position.createConstructionSite(STRUCTURE_CONTAINER)
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        if (creep.pos.isEqualTo(this.position)) {
            Assert.check(creep.harvest(this.source))
        } else {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(position))
            }
        }
    }
}

module.exports = Mine
