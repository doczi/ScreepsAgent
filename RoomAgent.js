Assert = require('Assert')

function createBlueprint(room) {
    var spawn = room.find(FIND_MY_SPAWNS)[0]
    var controllerPort = room.controller
    var blueprint = []
    for (var source of room.find(FIND_SOURCES)) {
        var path = source.pos.findPathTo(controllerPort, { ignoreCreeps: true, ignoreDestructibleStructures: true, range: 1 })
        blueprint.push({x: path[0].x, y: path[0].y, structureType: STRUCTURE_CONTAINER})
        if (controllerPort === room.controller) {
            const pos = path.pop()
            controllerPort = room.getPositionAt(pos.x, pos.y)
            blueprint.push({x: pos.x, y: pos.y, structureType: STRUCTURE_CONTAINER})
        }
        for (var j = 1; j < path.length; ++j) {
            blueprint.push({ x: path[j].x, y: path[j].y, structureType: STRUCTURE_ROAD})
        }
        path = room.getPositionAt(path[0].x, path[0].y).findPathTo(spawn, { ignoreCreeps: true, ignoreDestructibleStructures: true, range: 1 })
        for (var j = 0; j < path.length; ++j) {
            blueprint.push({ x: path[j].x, y: path[j].y, structureType: STRUCTURE_ROAD})
        }
    }
    return blueprint
}

function createActivities(room) {
    var activities = []
    var spawn = this.room.find(FIND_MY_SPAWNS)[0]
    const sources = this.room.find(FIND_SOURCES)
    for (var source of sources) {
        activities.push({
            task: 'build',
            sourceId: source.id
        })
    }
    for (var source of sources) {
        activities.push({
            task: 'mine',
            sourceId: source.id
        })
        activities.push({
            task: 'carry',
            fromId: source.id,
            toId: room.controller.id
        })
    }
}

function RoomAgent(game, memory, room) {
    this.memory = room.memory.roomAgent
    if (this.memory === undefined) {
        this.memory = {
            blueprint: createBlueprint(room),
            activities: createActivities(room)
        }
        room.memory.roomAgent = this.memory
    }
    this.room = room
}

RoomAgent.prototype.createStructures = function() {
    for (const structure of this.memory.blueprint) {
        this.room.createConstructionSite(structure.x, structure.y, structure.structureType)
    }
}

RoomAgent.prototype.performActivities = function() {
    for (const activity of this.memory.activities) {
        tasks[activity.task](activity)
    }
}

RoomAgent.prototype.spawnCreeps = function() {
    var spawn = this.room.find(FIND_MY_SPAWNS)[0]
    const sources = this.room.find(FIND_SOURCES)
    if (spawn === undefined) {
        return
    }
    var roles = {
        builder: {
            body: [ WORK, WORK, CARRY, MOVE ],
            count: 0
        },
        worker: {
            body: [ WORK, WORK, CARRY, MOVE ],
            count: 0
        },
        miner: {
            body: [ MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK],
            count: 0
        },
        carrier: {
            body: [ MOVE, CARRY, CARRY ],
            count: 0
        }
    }
    for (const creep of this.room.find(FIND_MY_CREEPS)) {
        roles[creep.role].count++
    }
    
    var creepToSpawn
    if (roles.builder.count < sources.length) {
        creepToSpawn = 'builder'
    } else if (roles.miner.count < sources.length) {
        creepToSpawn = 'miner'
    } else if (roles.worker.count < 1) {
        creepToSpawn = 'worker'
    }
    return
    if (spawn.spawnCreep(roles[creepToSpawn].body, creepToSpawn + this.globalMemory.nextId, { memory: { role: creepToSpawn} }) == OK) {
        this.globalMemory.nextId++
    }
}

RoomAgent.prototype.execute = function() {
    this.createStructures()
    this.spawnCreeps()
}

module.exports = RoomAgent
