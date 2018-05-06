function SpawnCreeps(game, memory) {
    var id = 'SpawnCreeps'
    
    this.memory = memory.groups[id]
    if (this.memory === undefined) {
        this.memory = {
            id: id
        }
        memory.groups[id] = this.memory
    }

    this.id = id
    this.creeps = {}
    this.game = game
    this.globalMemory = memory
}


SpawnCreeps.prototype.allocateSpawns = function(allocator) {
    allocator.allocateRatio(this, 'spawn', 1)
}

SpawnCreeps.prototype.allocateCreeps = function(allocator) {}

SpawnCreeps.prototype.execute = function() {
    const BASIC_WORKER = [ WORK, WORK, CARRY, MOVE ]
    const BASIC_ATTACKER = [ ATTACK, ATTACK, MOVE, MOVE ]

    for (var spawnId in this.creeps) {
        var spawn = this.creeps[spawnId]
        if (spawn.room.find(FIND_MY_CREEPS).length > 10) {
            continue
        }
        var creepToSpawn = BASIC_WORKER
        var role = 'worker'
        if (spawn.spawnCreep(creepToSpawn, role + this.globalMemory.nextId, { memory: { role: role} }) == OK) {
            this.globalMemory.nextId++
        }
    }
}

module.exports = SpawnCreeps
