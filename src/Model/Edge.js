export default class Edge {
  /**
   * 
   * @param {Vertex} vertex1 
   * @param {Vertex} vertex2 
   */
  constructor(vertex1, vertex2) {
    this.vertexOne = vertex1;
    this.vertexTwo = vertex2;
    //this.length = this.calculateLength(this.vertexOne, this.vertexTwo);
  }

  calculateLength(vertexOne, vertexTwo) {
    return Math.euclideanDistance2D(vertexOne, vertexTwo)
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
