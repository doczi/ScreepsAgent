const BASIC_WORKER = [ WORK, CARRY, CARRY, MOVE, MOVE ]
const BASIC_ATTACKER = [ ATTACK, ATTACK, MOVE, MOVE ]

countPartsInRoom = function(room) {
    creepsInRoom = room.find(FIND_CREEPS)
    var partsCount = {}
    partsCount[MOVE] = 0
    partsCount[WORK] = 0
    partsCount[ATTACK] = 0
    partsCount[CARRY] = 0
    partsCount[HEAL] = 0
    partsCount[RANGED_ATTACK] = 0
    partsCount[TOUGH] = 0
    partsCount[CLAIM] = 0
    for (var i = 0; i < creepsInRoom.length; ++i) {
        var creep = creepsInRoom[i]
        for (part in partsCount) {
            partsCount[part] += creep.getActiveBodyparts(part)
        }
    }
    return partsCount
}

module.exports = {
    execute: function(group) {
        if (Memory.nextCreepNumber === undefined) {
            Memory.nextCreepNumber = 0
        }
        for (spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName]
            if (spawn.memory.group !== group.name) {
                continue
            }
            partsCount = countPartsInRoom(spawn.room)
            var creepToSpawn
            //if (partsCount[WORK]*partsCount[WORK] + 10 <= partsCount[ATTACK]) {
                creepToSpawn = BASIC_WORKER
                creepName = 'Worker'
            /*} else {
                creepToSpawn = BASIC_ATTACKER
                creepName = 'Attacker'
            }*/
            if (spawn.spawnCreep(creepToSpawn, creepName + Memory.nextCreepNumber) == OK) {
                Memory.nextCreepNumber += 1
            }
        }
    },
    create: function(name) {
        var group = {}
        group.name = name
        group.task = "spawnCreeps"
        Memory.groups[name] = group
    }
}