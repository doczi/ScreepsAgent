Assert = require('Assert')
Spiral = require('Spiral')

function Build(game, memory, spawn) {
    var id = spawn.memory.buildId
    if (id === undefined) {
        id = 'Build' + memory.nextId++
        spawn.memory.buildId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id,
            spawnId: spawn.id,
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.spawn = game.getObjectById(this.memory.spawnId)
    this.source = game.getObjectById(this.memory.sourceId)
}

Build.prototype.allocateCreeps = function(allocator) {
    allocator.allocateFixed(this, 'builder', 1)
}

Build.prototype.execute = function() {
    const constructions = this.spawn.room.find(FIND_MY_CONSTRUCTION_SITES)
    const structures = this.spawn.room.find(FIND_STRUCTURES, { filter: function(structure) { return structure.hits < structure.hitsMax } })
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        var source = creep.pos.findClosestByPath(FIND_SOURCES)
        if (creep.pos.isNearTo(source) && (creep.carry.energy < creep.carryCapacity)) {
            Assert.check(creep.harvest(source))
        } else if (creep.carry.energy <= 0) {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(source))
            }
        } else if (constructions.length > 0) {
            if (creep.pos.inRangeTo(constructions[0],  3)) {
                Assert.check(creep.build(constructions[0]))
            } else {
                if (creep.fatigue <= 0) {
                    Assert.check(creep.moveTo(constructions[0]))
                }
            }
        } else if (structures.length > 0) {
            if (creep.pos.inRangeTo(structures[0],  3)) {
                Assert.check(creep.repair(structures[0]))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(structures[0]))
            }
        }
    }
}

module.exports = Build
