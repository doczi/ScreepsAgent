Assert = require('Assert')
Spiral = require('Spiral')

function Carry(game, memory, from, to) {
    var id = "Carry"

    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id,
            fromId: from.id,
            toId: to.id,
            path: from.pos.findPathTo(to, { ignoreCreeps: true, serialize: true })
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.spawn = game.getObjectById(this.memory.spawnId)
    this.from = game.getObjectById(this.memory.fromId)
    this.to = game.getObjectById(this.memory.toId)
    this.path = Room.deserializePath(this.memory.path)
}

Carry.prototype.allocateCreeps = function(allocator) {
    allocator.allocateFixed(this, 'carrier', 1)
}

Carry.prototype.execute = function() {
    for (var i = 0; i < this.path.length; ++i) {
        this.from.room.getPositionAt(this.path[i].x, this.path[i].y).createConstructionSite(STRUCTURE_ROAD)
    }
    for (var creepId in this.creeps) {
        var creep = this.creeps[creepId]
        if (creep.pos.isNearTo(this.from) && (creep.carry.energy < creep.carryCapacity)) {
            Assert.check(creep.withdraw(this.from, Math.min(creep.carryCapacity, this.from.store.energy)))
        } else if (creep.carry.energy <= 0) {
            if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.from))
            }
        } else {
            if (creep.pos.isNearTo(this.to)) {
                Assert.check(creep.transfer(this.to, RESOURCE_ENERGY))
            } else if (creep.fatigue <= 0) {
                Assert.check(creep.moveTo(this.to))
            }
        }
    }
}

module.exports = Carry
