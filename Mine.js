Assert = require('Assert')

function Mine(game, memory, source) {
    var sourceMemory = memory.sources[source.id]
    var id = sourceMemory.mineId
    if (id === undefined) {
        id = 'Mine' + memory.nextId++
        sourceMemory.mineId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        const p = source.pos
        const terrain = source.room.lookForAtArea(LOOK_TERRAIN, p.y - 1, p.x - 1, p.y + 1, p.x + 1, true)
        const found = terrain.find(pos => pos.terrain == 'plain')
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
    this.position = this.source.room.getPositionAt(sourceMemory.port.x, sourceMemory.port.y)
    this.container = this.position.lookFor(LOOK_STRUCTURES)
}

Mine.prototype.allocateCreeps = function(allocator) {
    if (this.container != undefined) {
        allocator.allocateFixed(this, 'miner', 1)
    }
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
