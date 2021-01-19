import MathExtension from "../Extensions/MathExtension"

export default class Triangle {

    constructor(vertex1, vertex2, vertex3) {
        this.vertexOne = vertex1;
        this.vertexTwo = vertex2;
        this.vertexThree = vertex3;
        this.edges = []
        this.getCircumCircleRadius = this.getCircumCircleRadius.bind(this)
        this.getCircumCircleCenter = this.getCircumCircleCenter.bind(this)
        this.circumCircleRadius = this.getCircumCircleRadius(this.vertexOne, this.vertexTwo, this.vertexThree);
        this.circumCircleCenter = this.getCircumCircleCenter(this.vertexOne, this.vertexTwo, this.vertexThree)
        this.minimumAngleVertex = this.minimumAngleVertex.bind(this)
        this.minimumAngle = this.minimumAngleVertex()
        this.verticesInCircumCircle = this.verticesInCircumCircle.bind(this)
        this.vertexInCircumCircle = this.vertexInCircumCircle.bind(this)
    }


    getCircumCircleRadius(x1, x2, x3) {
        let a = MathExtension.euclideanDistance2D(x1, x2)
        let b = MathExtension.euclideanDistance2D(x1, x3)
        let c = MathExtension.euclideanDistance2D(x2, x3)
        let s = (a + b + c) / 2
        let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
        return result
    }

    getCircumCircleCenter(x1, x2, x3) {
        let center = MathExtension.circumCircleCenter(x1, x2, x3)
        return { xPos: center.xPos, yPos: center.yPos }
    }


    //{ xPos: centerXPos, yPos: centerYPos, radius: radius }

    vertexInCircumCircle(vertex) {
        let distance = MathExtension.euclideanDistance2D(vertex, this.circumCircleCenter)
        if (distance < this.circumCircleRadius) {
            return true
        }
        return false

    }

    verticesInCircumCircle(vertices) {
        let result = []
        for (let vertex of vertices) {
            if (this.vertexInCircumCircle(vertex)) {
                result.push(vertex)
            }
        }
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
    // Super bad refractor with edge property
    getEdges(edges) {
        let edge1 = edges.find(edge => ((edge.vertexOne === this.vertexOne || edge.vertexOne === this.vertexTwo) && (edge.vertexTwo === this.vertexOne || edge.vertexTwo === this.vertexTwo)))  // 1 & 2
        let edge2 = edges.find(edge => ((edge.vertexOne === this.vertexOne || edge.vertexOne === this.vertexThree) && (edge.vertexTwo === this.vertexOne || edge.vertexTwo === this.vertexThree))) // 1 & 3
        let edge3 = edges.find(edge => ((edge.vertexOne === this.vertexTwo || edge.vertexOne === this.vertexThree) && (edge.vertexTwo === this.vertexTwo || edge.vertexTwo === this.vertexThree))) // 2 & 3
        return [edge1, edge2, edge3]
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


}