var CreepAllocator = require('CreepAllocator')
var Assert = require('Assert')


module.exports = {
    testConstructor: function() {
        var creeps = {
            creep1: {
                id: 'creep1',
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                id: 'creep2',
                spawning: false,
                memory: {
                    role: 'soldier'
                }
            },
            creep3: {
                id: 'creep3',
                spawning: true,
                memory: {
                    role: 'soldier'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)
        Assert.assertEquals(1, allocator.pool['worker'])
        Assert.assertEquals(1, allocator.pool['soldier'])
    },

    testAllocateFixed: function() {
        const mine = {
            id: 'mine',
            creeps: {}
        }
        var creeps = {
            creep1: {
                id: 'creep1',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                id: 'creep2',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep3: {
                id: 'creep3',
                spawning: false,
                memory: {
                    role: 'soldier'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)

        allocator.allocateFixed(mine, 'worker', 1)
        Assert.assertEquals(1, allocator.pool['worker'])
        Assert.assertEquals(1, allocator.pool['soldier'])
        Assert.assertEquals(1, allocator.allocations[mine.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 2)
        Assert.assertEquals(0, allocator.pool['worker'])
        Assert.assertEquals(1, allocator.pool['soldier'])
        Assert.assertEquals(2, allocator.allocations[mine.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        Assert.assertEquals(0, allocator.pool['worker'])
        Assert.assertEquals(1, allocator.pool['soldier'])
        Assert.assertEquals(2, allocator.allocations[mine.id]['worker'])
    },

    testAllocateRatio: function() {
        const mine = {
            id: 'mine',
            creeps: {}
        }
        const build = {
            id: 'build',
            creeps: {}
        }
        var creeps = {
            creep1: {
                id: 'creep1',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                id: 'creep2',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep3: {
                id: 'creep3',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep4: {
                id: 'creep4',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)

        allocator.allocateRatio(mine, 'worker', 0.5)
        Assert.assertEquals(2, allocator.pool['worker'])
        Assert.assertEquals(2, allocator.allocations[mine.id]['worker'])

        allocator.allocateRatio(build, 'worker', 0.75)
        Assert.assertEquals(1, allocator.pool['worker'])
        Assert.assertEquals(2, allocator.allocations[mine.id]['worker'])
        Assert.assertEquals(1, allocator.allocations[build.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        Assert.assertEquals(0, allocator.pool['worker'])
        Assert.assertEquals(3, allocator.allocations[mine.id]['worker'])
        Assert.assertEquals(1, allocator.allocations[build.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        Assert.assertEquals(0, allocator.pool['worker'])
        Assert.assertEquals(3, allocator.allocations[mine.id]['worker'])
        Assert.assertEquals(1, allocator.allocations[build.id]['worker'])
    },

    testReallocate: function() {
        const mine = {
            id: 'mine',
            creeps: {}
        }
        const build = {
            id: 'build',
            creeps: {}
        }
        const idle = {
            id: 'idle',
            creeps: {}
        }
        var creeps = {
            creep1: {
                id: 'creep1',
                spawning: false,
                memory: {
                    role: 'worker',
                    groupId: mine.id
                }
            },
            creep2: {
                id: 'creep2',
                spawning: false,
                memory: {
                    role: 'miner',
                    groupId: mine.id
                }
            },
            creep3: {
                id: 'creep3',
                spawning: false,
                memory: {
                    role: 'worker',
                    groupId: build.id
                }
            },
            creep4: {
                id: 'creep4',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep5: {
                id: 'creep5',
                spawning: true,
                memory: {
                    role: 'worker'
                }
            }
        }
        allocator = new CreepAllocator(creeps)
        
        allocator.reallocate(mine)
        Assert.assertEquals(1, allocator.allocations[mine.id]['worker'])
        Assert.assertEquals(1, allocator.allocations[mine.id]['miner'])
        
        allocator.allocateFixed(idle, 'worker', 2)
        Assert.assertEquals(2, allocator.allocations[idle.id]['worker'])
        
        allocator.reallocate(build)
        Assert.assertEquals(0, allocator.allocations[build.id]['worker'])
    },

    testAssignCreeps: function() {
        const mine = {
            id: 'mine',
            creeps: {}
        }
        const build = {
            id: 'build',
            creeps: {}
        }
        var creeps = {
            creep1: {
                id: 'creep1',
                spawning: false,
                memory: {
                    role: 'worker',
                    groupId: mine.id
                }
            },
            creep2: {
                id: 'creep2',
                spawning: false,
                memory: {
                    role: 'miner',
                    groupId: mine.id
                }
            },
            creep3: {
                id: 'creep3',
                spawning: false,
                memory: {
                    role: 'worker',
                    groupId: build.id
                }
            },
            creep4: {
                id: 'creep4',
                spawning: false,
                memory: {
                    role: 'worker'
                }
            },
            creep5: {
                id: 'creep5',
                spawning: true,
                memory: {
                    role: 'worker'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)
        
        allocator.allocateFixed(build, 'worker', 2)
        allocator.reallocate(mine)
        allocator.assignCreeps()
        Assert.assertEquals(mine.id, creeps.creep1.memory.groupId)
        Assert.assertEquals(true, creeps.creep1.id in mine.creeps)
        Assert.assertEquals(mine.id, creeps.creep2.memory.groupId)
        Assert.assertEquals(true, creeps.creep2.id in mine.creeps)
        Assert.assertEquals(build.id, creeps.creep3.memory.groupId)
        Assert.assertEquals(true, creeps.creep3.id in build.creeps)
        Assert.assertEquals(build.id, creeps.creep4.memory.groupId)
        Assert.assertEquals(true, creeps.creep4.id in build.creeps)
    }
}
