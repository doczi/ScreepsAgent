Assert = require('Assert')

function FillSpawn(game, memory, spawn) {
    var id = spawn.memory.fillSpawnId
    if (id === undefined) {
        id = 'FillSpawn' + memory.nextId++
        spawn.memory.fillSpawnId = id
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

    if (this.spawn.energy < this.spawn.energyCapacity) {
        this.target = this.spawn
    } else {
        const extensions = this.spawn.room.find(FIND_STRUCTURES, { filter: function(structure) {
            return (structure.structureType === STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)
        } })
        if (extensions.length > 0) {
            this.target = extensions[0]
        }
    }
}

FillSpawn.prototype.allocateCreeps = function(allocator) {
    if (this.target !== undefined) {
        allocator.allocateFixed(this, 'worker', 2)
    }
}

FillSpawn.prototype.execute = function() {
    for (var i = 0; i < this.path.length; i++) {
        this.spawn.room.getPositionAt(this.path[i].x, this.path[i].y).createConstructionSite(STRUCTURE_ROAD)
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
            const constructions = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3, { filter: { structureType: STRUCTURE_ROAD } })
            const structures = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: function(structure) { return structure.hits < structure.hitsMax } })
            if (constructions.length > 0) {
                Assert.check(creep.build(constructions[0]))
            } else if (structures.length > 0) {
                Assert.check(creep.repair(structures[0]))
            } else if (creep.pos.isNearTo(this.target)) {
                Assert.check(creep.transfer(this.target, RESOURCE_ENERGY))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.target))
            }
        }
    }
}

module.exports = FillSpawn
