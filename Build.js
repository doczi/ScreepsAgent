Assert = require('Assert')

function Build(game, memory, spawn) {
    var id = spawn.memory.buildId
    if (id === undefined) {
        id = 'Build' + memory.nextId++
        spawn.memory.buildId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        var source = spawn.pos.findClosestByPath(FIND_SOURCES)
        memory.sources[source.id].users++
        this.memory = {
            id: id,
            spawnId: spawn.id,
            sourceId: source.id,
            serializedPath: spawn.pos.findPathTo(source, { ignoreCreeps: true, serialize: true })
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.spawn = game.getObjectById(this.memory.spawnId)
    this.source = game.getObjectById(this.memory.sourceId)
    this.path = Room.deserializePath(this.memory.serializedPath)
}

Build.prototype.allocateSpawns = function(allocator) {}

Build.prototype.allocateCreeps = function(allocator) {
    allocator.allocateFixed(this, 'worker', 1)
}

Build.prototype.execute = function() {
    const offsets = [
        { x: -2, y:  0 },
        { x: -2, y: -2 },
        { x:  0, y: -2 },
        { x:  2, y: -2 },
        { x:  2, y:  0 },
        { x:  2, y:  2 },
        { x:  0, y:  2 },
        { x: -2, y:  2 },
        
    ]
    for (var i = 0; i < offsets.length; i++) {
        this.spawn.room.getPositionAt(this.spawn.pos.x + offsets[i].x, this.spawn.pos.y + offsets[i].y).createConstructionSite(STRUCTURE_EXTENSION)
    }
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        if (creep.pos.isNearTo(this.source) && (creep.carry.energy < creep.carryCapacity)) {
            Assert.check(creep.harvest(this.source))
        } else if (creep.carry.energy <= 0) {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.source))
            }
        } else {
            const constructions = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3)
            const structures = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: function(structure) { return structure.hits < structure.hitsMax } })
            if (constructions.length > 0) {
                Assert.check(creep.build(constructions[0]))
            } else if (structures.length > 0) {
                Assert.check(creep.repair(structures[0]))
            } else if (creep.pos.isNearTo(this.spawn)) {
                Assert.check(creep.transfer(this.spawn, RESOURCE_ENERGY))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.spawn))
            }
        }
    }
}

module.exports = Build
