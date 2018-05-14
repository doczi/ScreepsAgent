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
}

SpawnCreeps.prototype.allocateCreeps = function(allocator) {}

SpawnCreeps.prototype.bodyFromPattern = function(pattern) {
    var body = []
    var i = 0
    var sum = BODYPART_COST[pattern[i]]
    while (sum <= this.spawn.room.energyCapacityAvailable) {
        body.push(pattern[i % pattern.length])
        ++i
        sum += BODYPART_COST[pattern[i % pattern.length]]
    }
    return body
}

SpawnCreeps.prototype.execute = function() {
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
    const creeps = this.spawn.room.find(FIND_MY_CREEPS).length
    for (var i = 0; i < creeps.length; ++i) {
        const creep = creeps[i]
        roles[creep.role].count++
    }
    var creepToSpawn
    if (roles.builder.count  < 10) {
        creepToSpawn = 'builder'
    } else if (roles.miner.count < this.spawn.room.find(FIND_SOURCES).length) {
        creepToSpawn = 'miner'
    }
    if (this.spawn.spawnCreep(roles[creepToSpawn].body, creepToSpawn + this.globalMemory.nextId, { memory: { role: creepToSpawn} }) == OK) {
        this.globalMemory.nextId++
    }
}

module.exports = SpawnCreeps
