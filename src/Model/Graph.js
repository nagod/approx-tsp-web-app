import Vertex from "./Vertex";
export default class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
    this.hasVertices = this.hasVertices.bind(this);
    this.getVertices = this.getVertices.bind(this);
    this.getVertexAtIndex = this.getVertexAtIndex.bind(this);
    this.hasEdges = this.hasEdges.bind(this);
    this.getEdges = this.getEdges.bind(this);
    this.sortVerticesByXPos = this.sortVerticesByXPos.bind(this);
    this.sortVerticesByYPos = this.sortVerticesByYPos.bind(this);
    this.calculateConvexHull = this.calculateConvexHull.bind(this);
  }
  // Probably need to write some setter
  // vertices is an array. Need to write it for a single vertex?

  /**
   * @param {Array} vertices
   * @return {Graph}
   */
  addVertex(vertex, graph) {
    const { id, xPos, yPos } = vertex;
    graph.vertices.push(new Vertex(id, xPos, yPos));
  }

  static makeGraphFromVertices(vertices) {
    let graph = new Graph();
    vertices.forEach((vertex) => {
      graph.addVertex(vertex, graph);
    });

    return graph;
  }
  hasVertices() {
    return this.vertices.length > 0 ? true : false;
  }

  // Also for getEdges, is this the right way to handle an undefined error?
  // Do we even need to write a getter since you could just access the Instances proterty
  // Yes we  should, is commen practice in e.g Java

  getVertices() {
    if (!this.hasVertices()) {
      throw Error("Graph has no edges");
    }
    return this.vertices;
  }

  getVertexAtIndex(index) {
    return this.vertices[index];
  }

  sortVerticesByXPos() {
    //TODO: Implement error handling if
    return this.vertices.sort((x, y) => x.xPos - y.xPos);
  }

  sortVerticesByYPos() {
    return this.vertices.sort((x, y) => x.yPos - y.yPos);
  }

  hasEdges() {
    return this.edges.length > 0 ? true : false;
  }

  getEdges() {
    if (!this.hasEdges()) {
      throw Error("Graph has no edges");
    }
    return this.edges;
  }

  // Does not work when any of the vertices lies under p0
  // Does not matter in our use case since p0 is the lowest, leftmost point
  sortVerticesByPolarAnglesWithVertex(p0, vertices) {
    // TODO: Graham scan should only return the furthest point if two share the same polar angle
    let result = [...vertices];
    result = result.map((x) => [x, this.calculatePolarAngle(p0, x)]);
    result = result.sort((x, y) => x[1] - y[1]);
    result = result.flatMap((x) => x[0]);
    return result;
  }

  calculatePolarAngle(p0, vertex) {
    let point = {
      xPos: vertex.xPos - p0.xPos,
      yPos: vertex.yPos - p0.yPos,
    };
    // p0 will from now on be represented by the x axis vector (1, 0)
    // normalized the point because acos only accepts [-1, 1] as domain
    let normalizedPoint = this.normalize(point);
    let dotProduct = this.dotProduct2D({ xPos: 1, yPos: 0 }, normalizedPoint);
    let result = Math.acos(dotProduct);
    return result;
  }

  dotProduct2D(x, y) {
    return x.xPos * y.xPos + x.yPos * y.yPos;
  }

  // Length of vector, if no y is specified, it will return length of vector from origin
  euclideanDistance2D(x, y = { xPos: 0, yPos: 0 }) {
    return Math.sqrt(
      Math.pow(x.xPos - y.yPos, 2) + Math.pow(x.yPos - y.yPos, 2)
    );
  }

  normalize(x) {
    let length = this.euclideanDistance2D(x);
    if (length === 0) {
      return x;
    } else {
      return {
        xPos: x.xPos / length,
        yPos: x.yPos / length,
      };
    }
  }

  counterclockwise(x, y, z) {
    return (
      (y.xPos - x.xPos) * (z.yPos - x.yPos) -
      (z.xPos - x.xPos) * (y.yPos - x.yPos)
    );
  }

  // Returns a subset of the graphs vertices that build the convex hull.
  // The algoithms name is "Graham Scan"
  calculateConvexHull() {
    let points = this.sortVerticesByYPos();
    // Catch special case where two points share the same y-coordinate.
    // We want to set the leftmost as P0
    let p0 = points.shift();
    let sortedPoints = this.sortVerticesByPolarAnglesWithVertex(
      p0,
      sortedPoints
    );
    sortedPoints.unshift(p0);
    let stack = [];
    for (point in sortedPoints) {
      while (
        stack.length > 1 &&
        this.counterclockwise(
          stack[stack.length - 2],
          stack[stack.length - 1],
          point
        ) <= 0
      ) {
        stack.pop();
      }
      stack.push(point);
    }
    // Stack contains the convex hull points starting with p0 in counter clockwise orientation
    return stack;
  }
}
