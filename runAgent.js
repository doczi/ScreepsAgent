CreepAllocator = require('CreepAllocator')
SpawnCreeps = require('SpawnCreeps')
FillSpawn = require('FillSpawn')
Build = require('Build')
UpgradeRoomController = require('UpgradeRoomController')


var groups = []

function initializeMemory()
{
    if (Memory.nextId === undefined) {
        Memory.nextId = 0
    }
    if (Memory.controllers === undefined) {
        Memory.controllers = {}
    }
    if (Memory.sources === undefined) {
        Memory.sources = {}
    }
    if (Memory.groups === undefined) {
        Memory.groups = {}
    }
    for (var spawnId in Game.spawns) {
        var spawn = Game.spawns[spawnId]
        spawn.memory.role = 'spawn'

        var controller = spawn.room.controller
        if (Memory.controllers[controller.id] === undefined) {
            Memory.controllers[controller.id] = {}
        }

        var sources = spawn.room.find(FIND_SOURCES)
        for (var i = 0; i < sources.length; ++i) {
            if (Memory.sources[sources[i].id] === undefined) {
                Memory.sources[sources[i].id] = { users: 0 }
            }
        }
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
}

function updateGroups()
{
    for (spawnId in Game.spawns) {
        var spawn = Game.spawns[spawnId]
        groups.push(new SpawnCreeps(Game, Memory, spawn))
        groups.push(new FillSpawn(Game, Memory, spawn))
        groups.push(new Build(Game, Memory, spawn))

        var controller = spawn.room.controller
        groups.push(new UpgradeRoomController(Game, Memory, controller))
    }
}

function allocateCreeps()
{
    var creepAllocator = new CreepAllocator(Game.creeps)
    for (var groupId in groups) {
        groups[groupId].allocateCreeps(creepAllocator)
    }
    creepAllocator.assignCreeps()
}

function processGroups()
{
    for (var groupId in groups) {
        groups[groupId].execute()
    }
}

module.exports = function() {
    initializeMemory()
    updateGroups()
    allocateCreeps()
    processGroups()
}
