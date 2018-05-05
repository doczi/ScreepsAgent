function CreepAllocator(creeps) {
    this.creeps = creeps
    this.pool = {}
    this.allocations = {}
    this.reset()
}

CreepAllocator.prototype.getAvailableCount = function(role) {
    return this.pool[role] || 0
}

CreepAllocator.prototype.reset = function() {
    for (const creepId in this.creeps) {
        const creep = this.creeps[creepId]
        const role = creep.memory.role
        if (!creep.spawning) {
            this.pool[role] = this.getAvailableCount(role) + 1
        }
    }
}

CreepAllocator.prototype.allocateFixed = function(group, role, count) {
    const allocatedCount = Math.min(count, this.getAvailableCount(role))
    this.pool[role] -= allocatedCount
    if (!(group.id in this.allocations)) {
        this.allocations[group.id] = {}
    }
    if (!(role in this.allocations[group.id])) {
        this.allocations[group.id][role] = allocatedCount
    } else {
        this.allocations[group.id][role] += allocatedCount
    }
}

CreepAllocator.prototype.allocateRatio = function(group, role, ratio) {
    this.allocateFixed(group, role, Math.floor(this.getAvailableCount(role) * ratio))
}

CreepAllocator.prototype.reallocate = function(group) {
    for (const creepId in this.creeps) {
        const creep = this.creeps[creepId]
        if (creep.memory.groupId === group.id) {
            this.allocateFixed(group, creep.memory.role, 1)
        }
    }
}

CreepAllocator.prototype.assignCreeps = function() {
    var extras = {}
    for (const creepId in this.creeps) {
        const creep = this.creeps[creepId]
        const groupId = creep.memory.groupId
        const role = creep.memory.role
        if ((groupId in this.allocations) && (role in this.allocations[groupId]) && (this.allocations[groupId][role] > 0)) {
            this.allocations[creep.memory.groupId][creep.memory.role]--
        } else {
            if (role in extras) {
                extras[role].push(creep)
            } else {
                extras[role] = [ creep ]
            }
        }
    }

    for (const groupId in this.allocations) {
        for (const role in this.allocations[groupId]) {
            if (this.allocations[groupId][role] <= 0) {
                continue
            }
            if (!(role in extras)) {
                continue
            }
            var creep = extras[role].pop()
            creep.memory.groupId = groupId
            this.allocations[groupId][creep.memory.role]--
        }
    }
}

module.exports = CreepAllocator
