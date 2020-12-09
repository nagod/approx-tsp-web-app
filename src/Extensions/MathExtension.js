//TODO look up how to export this properly so that it extends the global object math

Math.euclideanDistance2D = function (x, y = { xPos: 0, yPos: 0 }) {
    return Math.sqrt(Math.pow(x.xPos - y.yPos, 2) + Math.pow(x.yPos - y.yPos, 2))
}