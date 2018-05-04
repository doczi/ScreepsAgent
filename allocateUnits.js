module.exports = {
    pool: {}
    allocations: {}
    
    reset: function(room) {
        pool['worker'] = 0
        pool['soldier'] = 0
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            pool[creep.Memory.role]++
        }
    }

    allocateFixed: function(group, role, count) {
        var allocatedCount = Math.min(count, pool[role])
        pool[role] -= allocatedCount
        allocations[group.name][role] += allocatedCount
    }

    allocateRatio: function(group, role, ratio) {
        allocateFixed(group, role, Math.floor(pool[role] * ratio))
    }

    reallocate: function(group) {
        var allocation = allocations[group.name];
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            if (creep.Memory.group !== group.name) {
                continue
            }
            if (pool[creep.Memory.role] <= 0) {
                Console.log("Not enough units in pool")
                return
            }
            pool[creep.Memory.role]--
            allocations[group.name][creep.Memory.role]++
        }
    }

    assignUnits: function() {
        var extras = {}
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            if (allocations[creep.Memory.group][creep.Memory.role] > 0) {
                allocations[creep.Memory.group][creep.Memory.role]--
            } else {
                extras[creep.Memory.role].push(creep)
            }
        }

        for (groupName in allocations) {
            for (roles) {
                var creep = extras[role].pop()
                creep.Memory.group = groupName
                allocations[groupName][creep.Memory.role]--
            }
        }
    }
}
