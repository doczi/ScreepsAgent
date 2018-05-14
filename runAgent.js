RoomAgent = require('RoomAgent')

module.exports = function() {
    for (roomId in Game.rooms) {
        var roomAgent = new RoomAgent(Game, Memory, Game.rooms[roomId])
        roomAgent.execute()
    }
}
