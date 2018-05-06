module.exports = {
    check: function(status) {
        if (status != OK) {
            throw Error('Error: ' + status)
        }
    },

    assertEquals: function(expected, actual) {
        if (!(expected === actual)) {
            throw new Error("Assertion '" + expected + " === " + actual + " 'failed")
        }
    },

    assertTrue: function(value) {
        if (!value) {
            throw new Error('Assertion failed')
        }
    }
}
