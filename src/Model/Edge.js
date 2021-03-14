import Config from '../App/Config'
import MathExtension from '../Extensions/MathExtension'

export default class Edge {

    constructor(vertex1, vertex2) {
        this.vertexOne = vertex1;
        this.vertexTwo = vertex2;
        this.color = Config.defaultEdgeColor
        this.length = this.calculateLength(this.vertexOne, this.vertexTwo);
        console.log(this.length)
    }

    calculateLength(vertexOne, vertexTwo) {
        return MathExtension.euclideanDistance2D(vertexOne, vertexTwo)
    }

    getVertexOne() {
        return this.vertexOne;
    }

    getVertexTwo() {
        return this.vertexTwo;
    }

    getLength() {
        return this.length;
    }

    setVertexOne(vertex) {
        this.vertexOne = vertex
    }

    setVertexTwo(vertex) {
        this.vertexTwo = vertex
    }
}
