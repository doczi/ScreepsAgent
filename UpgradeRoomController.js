Assert = require('Assert')

function UpgradeRoomController(game, memory, controller) {
    var id = memory.controllers[controller.id].upgradeRoomControllerId
    if (id === undefined) {
        id = 'UpgradeRoomController' + memory.nextId++
        memory.controllers[controller.id].upgradeRoomControllerId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id,
            controllerId: controller.id,
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.controller = game.getObjectById(this.memory.controllerId)
    const p = controller.pos
    const terrain = this.controller.room.lookForAtArea(LOOK_TERRAIN, p.y - 1, p.x - 1, p.y + 1, p.x + 1, true)
    const found = terrain.find(pos => pos.terrain == 'plain')
    this.position = this.controller.room.getPositionAt(found.x, found.y)
    this.container = this.position.lookFor(LOOK_STRUCTURES)
}

UpgradeRoomController.prototype.allocateCreeps = function(allocator) {
    allocator.allocateRatio(this, 'worker', 1)
}

UpgradeRoomController.prototype.execute = function() {
    this.position.createConstructionSite(STRUCTURE_CONTAINER)
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        if (creep.pos.isEqualTo(this.position)) {
            if (creep.carry.energy > 0) {
                Assert.check(creep.upgradeController(this.controller))
            } else {
                Assert.check(creep.withdraw(this.container, RESOURCE_ENERGY, Math.min(this.container.store[RESOURCE_ENERGY], creep.carryCapacity)))
            }
        } else {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(position))
            }
        }
    }
}

module.exports = UpgradeRoomController
