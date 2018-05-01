tasks = {
    fillSpawn: require('fillSpawn'),
    upgradeRoomController: require('upgradeRoomController'),
    spawnCreeps: require('spawnCreeps'),
    expand: require('expand')
}

function cleanUpMemory()
{
    for (var creep in Memory.creeps) {
        if (Game.creeps[creep] === undefined) {
            Memory.creeps[creep] = undefined
        }
    }
}

function updateGroups()
{
    if (Memory.groups === undefined) {
        Memory.groups = {}
    }
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
    var i = 0;
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        if (creep.getActiveBodyparts(WORK) > 0) {
            if (i < 2) {
                creep.memory.group = "fillSpawn1"
            } else {
                creep.memory.group = "upgradeRoomController1"
            }
            i = i + 1
        } else {
            creep.memory.group = "expand1"
        }
    }
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name]
        spawn.memory.group = "spawnCreeps1"
    }
}

function processGroups()
{
    for (name in Memory.groups) {
        var group = Memory.groups[name]
        tasks[group.task].execute(group)
    }
}

cleanUpMemory()
updateGroups()
allocateCreeps()
processGroups()
