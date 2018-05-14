Assert = require('Assert')

function RoomAgent(game, memory, room) {
    this.memory = room.memory.roomAgent
    if (this.memory === undefined) {
        var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } })
        var spawn = spawns[0]
        var controllerPort = room.controller
        var structures = []
        const sources = room.find(FIND_SOURCES)
        for (var i = 0; i < sources.length; ++i) {
            var path = sources[i].pos.findPathTo(controllerPort, { ignoreCreeps: true, ignoreDestructibleStructures: true, range: 1 })
            structures.push({x: path[0].x, y: path[0].y, structureType: STRUCTURE_CONTAINER})
            if (controllerPort === room.controller) {
                const pos = path.pop()
                controllerPort = room.getPositionAt(pos.x, pos.y)
                structures.push({x: pos.x, y: pos.y, structureType: STRUCTURE_CONTAINER})
            }
            for (var j = 1; j < path.length; ++j) {
                structures.push({ x: path[j].x, y: path[j].y, structureType: STRUCTURE_ROAD})
            }
            path = sources[i].pos.findPathTo(spawn, { ignoreCreeps: true, ignoreDestructibleStructures: true, range: 1 })
            for (var j = 0; j < path.length; ++j) {
                structures.push({ x: path[j].x, y: path[j].y, structureType: STRUCTURE_ROAD})
            }
        }
        this.memory = {
            structures: structures
        }
        room.memory.roomAgent = this.memory
    }
    this.room = room
}

RoomAgent.prototype.createBasicStructures = function() {
    for (var i = 0; i < this.memory.structures.length; ++i) {
        this.room.createConstructionSite(this.memory.structures[i].x, this.memory.structures[i].y, this.memory.structures[i].structureType)
    }
}

RoomAgent.prototype.execute = function() {
    this.createBasicStructures()
}

module.exports = RoomAgent
