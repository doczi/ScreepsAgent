var CreepAllocator = require('CreepAllocator')



function assertEquals(expected, actual) {
    if (!(expected === actual)) throw new Error("Assertion '" + expected + " === " + actual + " 'failed")
}



module.exports = {
    testConstructor: function() {
        var creeps = {
            creep1: {
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                memory: {
                    role: 'soldier'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)
        assertEquals(1, allocator.pool['worker'])
        assertEquals(1, allocator.pool['soldier'])
    },

    testAllocateFixed: function() {
        const mine = { id: 'mine' }
        var creeps = {
            creep1: {
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                memory: {
                    role: 'worker'
                }
            },
            creep3: {
                memory: {
                    role: 'soldier'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)

        allocator.allocateFixed(mine, 'worker', 1)
        assertEquals(1, allocator.pool['worker'])
        assertEquals(1, allocator.pool['soldier'])
        assertEquals(1, allocator.allocations[mine.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 2)
        assertEquals(0, allocator.pool['worker'])
        assertEquals(1, allocator.pool['soldier'])
        assertEquals(2, allocator.allocations[mine.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        assertEquals(0, allocator.pool['worker'])
        assertEquals(1, allocator.pool['soldier'])
        assertEquals(2, allocator.allocations[mine.id]['worker'])
    },

    testAllocateRatio: function() {
        const mine = { id: 'mine' }
        const build = { id: 'build' }
        var creeps = {
            creep1: {
                memory: {
                    role: 'worker'
                }
            },
            creep2: {
                memory: {
                    role: 'worker'
                }
            },
            creep3: {
                memory: {
                    role: 'worker'
                }
            },
            creep4: {
                memory: {
                    role: 'worker'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)

        allocator.allocateRatio(mine, 'worker', 0.5)
        assertEquals(2, allocator.pool['worker'])
        assertEquals(2, allocator.allocations[mine.id]['worker'])

        allocator.allocateRatio(build, 'worker', 0.75)
        assertEquals(1, allocator.pool['worker'])
        assertEquals(2, allocator.allocations[mine.id]['worker'])
        assertEquals(1, allocator.allocations[build.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        assertEquals(0, allocator.pool['worker'])
        assertEquals(3, allocator.allocations[mine.id]['worker'])
        assertEquals(1, allocator.allocations[build.id]['worker'])

        allocator.allocateFixed(mine, 'worker', 1)
        assertEquals(0, allocator.pool['worker'])
        assertEquals(3, allocator.allocations[mine.id]['worker'])
        assertEquals(1, allocator.allocations[build.id]['worker'])
    },

    testReallocate: function() {
        const mine = { id: 'mine' }
        const build = { id: 'build' }
        const idle = { id: 'idle' }
        var creeps = {
            creep1: {
                memory: {
                    role: 'worker',
                    groupId: mine.id
                }
            },
            creep2: {
                memory: {
                    role: 'miner',
                    groupId: mine.id
                }
            },
            creep3: {
                memory: {
                    role: 'worker',
                    groupId: build.id
                }
            },
            creep4: {
                memory: {
                    role: 'worker'
                }
            }
        }
        allocator = new CreepAllocator(creeps)
        
        allocator.reallocate(mine)
        assertEquals(1, allocator.allocations[mine.id]['worker'])
        assertEquals(1, allocator.allocations[mine.id]['miner'])
        
        allocator.allocateFixed(idle, 'worker', 2)
        assertEquals(2, allocator.allocations[idle.id]['worker'])
        
        allocator.reallocate(build)
        assertEquals(0, allocator.allocations[build.id]['worker'])
    },

    testAssignCreeps: function() {
        const mine = { id: 'mine' }
        const build = { id: 'build' }
        var creeps = {
            creep1: {
                memory: {
                    role: 'worker',
                    groupId: mine.id
                }
            },
            creep2: {
                memory: {
                    role: 'miner',
                    groupId: mine.id
                }
            },
            creep3: {
                memory: {
                    role: 'worker',
                    groupId: build.id
                }
            },
            creep4: {
                memory: {
                    role: 'worker'
                }
            }
        }
        var allocator = new CreepAllocator(creeps)
        
        allocator.allocateFixed(build, 'worker', 2)
        allocator.reallocate(mine)
        allocator.assignCreeps()
        assertEquals(mine.id, creeps.creep1.memory.groupId)
        assertEquals(mine.id, creeps.creep2.memory.groupId)
        assertEquals(build.id, creeps.creep3.memory.groupId)
        assertEquals(build.id, creeps.creep4.memory.groupId)
    }
}
