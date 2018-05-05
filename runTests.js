function runTestSuite(suiteName) {
    console.log('Running test suite: ' + suiteName)
    var suite = require(suiteName)
    for (var testName in suite) {
        console.log('[ RUN  ] ' + testName)
        suite[testName]()
        console.log('[  OK  ] ' + testName)
    }
}

module.exports = function() {
    runTestSuite('CreepAllocatorTest')
}
