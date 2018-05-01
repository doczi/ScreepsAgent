module.exports = {
    execute: function(group) {
        var controller = Game.getObjectById(group.controllerId)
        var source = Game.getObjectById(group.sourceId)
        path = controller.pos.findPathTo(source, { ignoreCreeps: true })
        for (var i = 0; i < path.length; i++) {
            controller.room.getPositionAt(path[i].x, path[i].y).createConstructionSite(STRUCTURE_ROAD)
        }
        for (creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            if (creep.memory.group !== group.name) {
                continue
            }
            if (creep.pos.isNearTo(source) && (creep.carry.energy < creep.carryCapacity)) {
                creep.harvest(source)
            } else if (creep.carry.energy <= 0) {
                creep.moveTo(source)
            } else {
                roads = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3)
                if (roads.length > 0) {
                    creep.build(roads[0])
                } else if (creep.pos.inRangeTo(controller, 3)) {
                    creep.upgradeController(controller)
                } else {
                    creep.moveTo(controller)
                }
            }
        }
    },
    create: function(name, controller, source) {
        var group = {}
        group.name = name
        group.task = "upgradeRoomController"
        group.controllerId = controller.id
        group.sourceId = source.id
        Memory.groups[name] = group
    }
}