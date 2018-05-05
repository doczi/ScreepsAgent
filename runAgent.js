CreepAllocator = require('CreepAllocator')
var tasks = {
    SpawnCreeps: require('SpawnCreeps'),
    fillSpawn: require('fillSpawn'),
    upgradeRoomController: require('upgradeRoomController'),
    expand: require('expand')
}

function initializeMemory()
{
    if (Memory.groups === undefined) {
        Memory.groups = {}
    }
    if (Memory.nextCreepNumber === undefined) {
        Memory.nextCreepNumber = 0
    }
    for (const creepId in Memory.creeps) {
        if (Game.creeps[creepId] === undefined) {
            Memory.creeps[creepId] = undefined
        }
    }
    for (const spawnId in Memory.spawns) {
        if (Game.spawns[spawnId] === undefined) {
            Memory.spawns[spawnId] = undefined
        }
    }
    for (var spawnId in Game.spawns) {
        Game.spawns[spawnId].memory.role = 'spawn'
    }
}

function updateGroups()
{
    if (Memory.groups.fillSpawn1 === undefined) {
        var spawn = Game.spawns['Spawn1']
        var source = spawn.room.find(FIND_SOURCES)[0]
        tasks.fillSpawn.create("fillSpawn1", spawn, source)
    }
    if (Memory.groups.upgradeRoomController1 === undefined) {
        var spawn = Game.spawns['Spawn1']
        var controller = spawn.room.controller
        var sources = spawn.room.find(FIND_SOURCES)
        var source = sources[1 % sources.length]
        tasks.upgradeRoomController.create("upgradeRoomController1", controller, source)
    }
    if (Memory.groups.spawnCreeps1 === undefined) {
        tasks.spawnCreeps.create("spawnCreeps1")
    }
    if (Memory.groups.expand1 === undefined) {
        tasks.expand.create("expand1")
    }
}

function allocateCreeps()
{
    var creepAllocator = new CreepAllocator(Game.creeps)
    creepAllocator.allocateFixed('fillSpawn1', 'worker', 2)
    creepAllocator.allocateRatio('upgradeRoomController1', 'worker', 1)
    creepAllocator.assignCreeps()

    var spawnAllocator = new CreepAllocator(Game.creeps)
    spawnAllocator.allocateRatio('spawnCreeps1', 'spawn', 1)
    spawnAllocator.assignCreeps()
}

function processGroups()
{
    for (var name in Memory.groups) {
        var group = Memory.groups[name]
        tasks[group.task].execute(group)
    }
}

module.exports = function() {
    initializeMemory()
    updateGroups()
    allocateCreeps()
    processGroups()
}
