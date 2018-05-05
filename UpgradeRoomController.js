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
    for (var creepId in Game.creeps) {
        var creep = Game.creeps[creepId]
        if (creep.memory.groupId !== this.id) {
            continue
        }
        if (creep.pos.isNearTo(this.source) && (creep.carry.energy < creep.carryCapacity)) {
            creep.harvest(this.source)
        } else if (creep.carry.energy <= 0) {
            creep.moveTo(this.source)
        } else {
            var roads = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3)
            if (roads.length > 0) {
                creep.build(roads[0])
            } else if (creep.pos.inRangeTo(this.controller, 3)) {
                creep.upgradeController(this.controller)
            } else {
                creep.moveTo(this.controller)
            }
        }
    }
}

module.exports = UpgradeRoomController
