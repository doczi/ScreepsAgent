module.exports = {
    execute: function(group) {
        var spawn = Game.getObjectById(group.spawnId)
        var source = Game.getObjectById(group.sourceId)
        var path = Room.deserializePath(group.path)
        for (var i = 0; i < path.length; i++) {
            spawn.room.getPositionAt(path[i].x, path[i].y).createConstructionSite(STRUCTURE_ROAD)
        }
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            if (creep.memory.group !== group.name) {
                continue
            }
            if (creep.pos.isNearTo(source) && (creep.carry.energy < creep.carryCapacity)) {
                creep.harvest(source)
            } else if (creep.carry.energy <= 0) {
                creep.moveTo(source)
            } else {
                var roads = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3)
                if (roads.length > 0) {
                    creep.build(roads[0])
                } else if (creep.pos.isNearTo(spawn)) {
                    creep.transfer(spawn, RESOURCE_ENERGY)
                } else {
                    creep.moveTo(spawn)
                }
            }
        }
    },
    create: function(name, spawn, source) {
        var group = {}
        group.name = name
        group.task = "fillSpawn"
        group.spawnId = spawn.id
        group.sourceId = source.id
        group.path = spawn.pos.findPathTo(source, { ignoreCreeps: true, serialize: true })
        Memory.groups[name] = group
    }
};