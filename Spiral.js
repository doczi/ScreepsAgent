function Spiral(center, step) {
    this.step = step
    this.direction = TOP
    this.counter = 0
    this.max = 1
    this.x = center.x
    this.y = center.y
    this.roomName = center.roomName
}

Spiral.prototype.next = function() {
    result = new RoomPosition(this.x, this.y, this.roomName)
    switch(this.direction) {
    case TOP:
        this.y -= this.step
        if (++this.counter === this.max) {
            this.counter = 0
            this.direction = RIGHT
        }
        break;
    case RIGHT:
        this.x += this.step
        if (++this.counter === this.max) {
            this.counter = 0
            this.direction = BOTTOM
            this.max++
        }
        break;
    case BOTTOM:
        this.y += this.step
        if (++this.counter === this.max) {
            this.counter = 0
            this.direction = LEFT
        }
        break;
    case LEFT:
        this.x -= this.step
        if (++this.counter === this.max) {
            this.counter = 0
            this.direction = TOP
            this.max++
        }
        break;
    default:
        throw Error('invalid direction')
    } 
    return result
}

module.exports = Spiral
