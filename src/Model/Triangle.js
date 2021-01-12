import MathExtension from "../Extensions/MathExtension"

export default class Triangle {

    constructor(vertex1, vertex2, vertex3) {
        //console.log("created triangle with: ", vertex1, vertex2, vertex3)
        this.vertexOne = vertex1;
        this.vertexTwo = vertex2;
        this.vertexThree = vertex3;
        this.getCircumCircleRadius = this.circumCircleRadius.bind(this)
        this.circumCircleRadius = this.circumCircleRadius(this.vertexOne, this.vertexTwo);
        this.minimumAngleVertex = this.minimumAngleVertex.bind(this)
        this.minimumAngle = this.minimumAngleVertex()
    }

    circumCircleRadius(x1, x2, x3) {
        let a = MathExtension.euclideanDistance2D(x1, x2)
        let b = MathExtension.euclideanDistance2D(x1, x3)
        let c = MathExtension.euclideanDistance2D(x2, x3)
        let s = (a + b + c) / 2
        let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
        return result
    }

    minimumAngleVertex() {
        let ab = { xPos: this.vertexTwo.xPos - this.vertexOne.xPos, yPos: this.vertexTwo.yPos - this.vertexOne.yPos }
        let ac = { xPos: this.vertexThree.xPos - this.vertexOne.xPos, yPos: this.vertexThree.yPos - this.vertexOne.yPos }
        let ba = { xPos: this.vertexOne.xPos - this.vertexTwo.xPos, yPos: this.vertexOne.yPos - this.vertexTwo.yPos }
        let bc = { xPos: this.vertexThree.xPos - this.vertexTwo.xPos, yPos: this.vertexThree.yPos - this.vertexTwo.yPos }
        let ca = { xPos: this.vertexOne.xPos - this.vertexThree.xPos, yPos: this.vertexOne.yPos - this.vertexThree.yPos }
        let cb = { xPos: this.vertexTwo.xPos - this.vertexThree.xPos, yPos: this.vertexTwo.yPos - this.vertexThree.yPos }
        let alpha = MathExtension.angle(ab, ac)
        let beta = MathExtension.angle(ba, bc)
        let gamma = MathExtension.angle(ca, cb)
        return Math.min(alpha, beta, gamma)
    }

    getVertexOne() {
        return this.vertexOne;
    }

    getVertexTwo() {
        return this.vertexTwo;
    }

    getVertexThree() {
        return this.vertexThree;
    }

    getCircumCircleRadius() {
        return this.circumCircleRadius;
    }

}