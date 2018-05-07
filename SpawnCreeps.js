Assert = require('Assert')

function SpawnCreeps(game, memory, spawn) {
    var id = 'SpawnCreeps'
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.spawn = spawn
    this.game = game
    this.globalMemory = memory
    const extensions = this.spawn.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } })
    this.totalCapacity = extensions.reduce((acc, extension) => acc + extension.energyCapacity, this.spawn.energyCapacity)
}

SpawnCreeps.prototype.allocateCreeps = function(allocator) {}

SpawnCreeps.prototype.bodyFromPattern = function(pattern) {
    var body = []
    var i = 0
    var sum = BODYPART_COST[pattern[i]]
    while (sum <= this.totalCapacity) {
        body.push(pattern[i % pattern.length])
        ++i
        sum += BODYPART_COST[pattern[i % pattern.length]]
    }
    return body
}

SpawnCreeps.prototype.execute = function() {
    if (this.spawn.room.find(FIND_MY_CREEPS).length > 12) {
        return
    }
    var creepToSpawn = this.bodyFromPattern([ MOVE, CARRY, WORK, WORK ])
    var role = 'worker'
    if (this.spawn.spawnCreep(creepToSpawn, role + this.globalMemory.nextId, { memory: { role: role} }) == OK) {
        this.globalMemory.nextId++
    }
}

module.exports = SpawnCreeps
