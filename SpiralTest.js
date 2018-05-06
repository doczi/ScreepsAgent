var Spiral = require('Spiral')
var Assert = require('Assert')



module.exports = {
    testConstructor: function() {
        var pos = new RoomPosition(32, 32, 'room')
        var spiral = new Spiral(pos, 1)
        Assert.assertTrue(spiral.next().isEqualTo(pos))
    },

    testDistanceOne: function() {
        var spiral = new Spiral(new RoomPosition(32, 32, 'room'), 1)
        Assert.assertTrue(spiral.next().isEqualTo(32, 32))
        Assert.assertTrue(spiral.next().isEqualTo(32, 31))
        Assert.assertTrue(spiral.next().isEqualTo(33, 31))
        Assert.assertTrue(spiral.next().isEqualTo(33, 32))
        Assert.assertTrue(spiral.next().isEqualTo(33, 33))
        Assert.assertTrue(spiral.next().isEqualTo(32, 33))
        Assert.assertTrue(spiral.next().isEqualTo(31, 33))
        Assert.assertTrue(spiral.next().isEqualTo(31, 32))
        Assert.assertTrue(spiral.next().isEqualTo(31, 31))
        Assert.assertTrue(spiral.next().isEqualTo(31, 30))
    },

    testDistanceTwo: function() {
        var spiral = new Spiral(new RoomPosition(32, 32, 'room'), 2)
        Assert.assertTrue(spiral.next().isEqualTo(32, 32))
        Assert.assertTrue(spiral.next().isEqualTo(32, 30))
        Assert.assertTrue(spiral.next().isEqualTo(34, 30))
        Assert.assertTrue(spiral.next().isEqualTo(34, 32))
        Assert.assertTrue(spiral.next().isEqualTo(34, 34))
    }
}