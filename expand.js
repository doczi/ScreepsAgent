module.exports = {
    execute: function(group) {
        return
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName]
            if (creep.memory.group !== group.name) {
                continue
            }
            creep.moveTo(3, 28)
        }
    },
    create: function(name) {
        var group = {}
        group.name = name
        group.task = "expand"
        Memory.groups[name] = group
    }
};