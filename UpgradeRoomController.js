Assert = require('Assert')

function UpgradeRoomController(game, memory, controller) {
    var id = memory.controllers[controller.id].upgradeRoomControllerId
    if (id === undefined) {
        id = 'UpgradeRoomController' + memory.nextId++
        memory.controllers[controller.id].upgradeRoomControllerId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        var source = controller.pos.findClosestByPath(FIND_SOURCES)
        memory.sources[source.id].users++
        this.memory = {
            id: id,
            controllerId: controller.id,
            sourceId: source.id,
            serializedPath: controller.pos.findPathTo(source, { ignoreCreeps: true, serialize: true })
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.controller = game.getObjectById(this.memory.controllerId)
    this.source = game.getObjectById(this.memory.sourceId)
    this.path = Room.deserializePath(this.memory.serializedPath)
}

UpgradeRoomController.prototype.allocateSpawns = function(allocator) {}

UpgradeRoomController.prototype.allocateCreeps = function(allocator) {
    allocator.allocateRatio(this, 'worker', 1)
}

UpgradeRoomController.prototype.execute = function() {
    for (var i = 0; i < this.path.length; i++) {
        this.controller.room.getPositionAt(this.path[i].x, this.path[i].y).createConstructionSite(STRUCTURE_ROAD)
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
            } else if (creep.pos.inRangeTo(this.controller, 3)) {
                Assert.check(creep.upgradeController(this.controller))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.controller))
            }
        }
    }
}

module.exports = UpgradeRoomController
