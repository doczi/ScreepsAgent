function FillSpawn(game, memory, spawn) {
    var id = spawn.memory.fillSpawnId
    if (id === undefined) {
        id = 'FillSpawn' + memory.nextId++
        spawn.memory.fillSpawnId = id
    }
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        var source = spawn.pos.findClosestByPath(FIND_SOURCES)
        memory.sources[source.id].users++
        this.memory = {
            id: id,
            spawnId: spawn.id,
            sourceId: source.id,
            serializedPath: spawn.pos.findPathTo(source, { ignoreCreeps: true, serialize: true })
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.game = game
    this.spawn = game.getObjectById(this.memory.spawnId)
    this.source = game.getObjectById(this.memory.sourceId)
    this.path = Room.deserializePath(this.memory.serializedPath)
}

FillSpawn.prototype.allocateSpawns = function(allocator) {}

FillSpawn.prototype.allocateCreeps = function(allocator) {
    allocator.allocateFixed(this, 'worker', 1)
}

FillSpawn.prototype.execute = function() {
    for (var i = 0; i < this.path.length; i++) {
        this.spawn.room.getPositionAt(this.path[i].x, this.path[i].y).createConstructionSite(STRUCTURE_ROAD)
    }
    for (var creepId in this.game.creeps) {
        var creep = this.game.creeps[creepId]
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
            } else if (creep.pos.isNearTo(this.spawn)) {
                creep.transfer(this.spawn, RESOURCE_ENERGY)
            } else {
                creep.moveTo(this.spawn)
            }
        }
    }
}

module.exports = FillSpawn
