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
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        const construction = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES)
        const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax })
        const source = creep.pos.findClosestByPath(FIND_SOURCES)
        if (creep.pos.isNearTo(source) && (creep.carry.energy < creep.carryCapacity)) {
            Assert.check(creep.harvest(source))
        } else if (creep.carry.energy <= 0) {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(source))
            }
        } else if (construction != undefined) {
            if (creep.pos.inRangeTo(construction, 3)) {
                Assert.check(creep.build(construction))
            } else {
                if (creep.fatigue <= 0) {
                    Assert.check(creep.moveTo(construction))
                }
            }
        } else if (structure != undefined) {
            if (creep.pos.inRangeTo(structure, 3)) {
                Assert.check(creep.repair(structure))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(structure))
            }
        }
    }
}

module.exports = Build
