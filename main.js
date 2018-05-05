const testing = true
const reset = false

if (testing) {
    require('runTests')()
} else {
    require('runAgent')()
}

if (reset) {
    Memory.groups = {}
}
