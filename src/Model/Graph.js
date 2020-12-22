import Vertex from "./Vertex";
import Edge from "./Edge";
import Observable from "../Architecture/Observable";

export default class Graph extends Observable {
    constructor() {
        super()
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
        this.addVertex = this.addVertex.bind(this);
        this.addVertexFromData = this.addVertexFromData.bind(this);
        this.makeGraphFromData = this.makeGraphFromData.bind(this);
        this.connectConvexHull = this.connectConvexHull.bind(this);
        this.cost = this.cost.bind(this)
    }
    // Probably need to write some setter
    // vertices is an array. Need to write it for a single vertex?

    /**
     *  Extends the Observable class.
     *  Existing notification identifiers:
     * - "vertexAddedNotification"
     * - "vertexDeletedNotification"
     * - "edgeAddedNotification"
     * - "edgeDeletedNotification"
    */


    /**
     * @param {Array} vertices
     * @return {Graph}
     */

    addVertex(vertex) {
        this.vertices.push(vertex)
        this.notify("vertexAddedNotification", vertex)
    }

    addVertexFromData(id, xPos, yPos) {
        const vertex = new Vertex(id, xPos, yPos)
        this.vertices.push(vertex);
        this.notify("vertexAddedNotification", vertex)
    }

    makeGraphFromData(vertices) {
        vertices.forEach((vertex) => {
            this.addVertex(vertex);
        });

        return this;
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

    getVertexWithID(id) {
        return this.vertices.find(x => x.id === id)
    }

    getVertexIndexWithId(id) {
        return this.vertices.findIndex(x => x.id === id)
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

    // Keeps the first element but returns all other elements sorted by clockwise polar angle
    sortVerticesByPolarAnglesWithVertexClockwise(p0, vertices) {
        let result = this.sortVerticesByPolarAnglesWithVertex(p0, vertices)
        let firstElement = result.shift()
        result.reverse()
        return [firstElement, ...result]
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
        console.log("used euclidenDistance2D with: ", x, y)
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
        this.sortVerticesByYPos();
        let points = [...this.vertices]
        // Catch special case where two points share the same y-coordinate.
        // We want to set the leftmost as P0
        let p0 = points.shift();
        let sortedPoints = this.sortVerticesByPolarAnglesWithVertex(
            p0,
            points
        );
        sortedPoints.unshift(p0);
        let stack = this.edges//[];
        for (let point of sortedPoints) {
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

    // Following the paper: https://dccg.upc.edu/people/rodrigo/pubs/PolygonHODT_LATIN.pdf
    // The input of the algorithm is a polygon P , defined by its vertices in clockwise order: p0, p1, . . . , pn−1
    // The output is a k-OD triangulation of optimum cost, if it exists. 
    // => Use cc algorithm and reverse it

    kOrderDelaunay(array) {
        const n = array.length
        let result = []
        for (let m = 1; m <= n; m++) {
            result.push(new Array(n))
        }
        for (let i = 0; i < n; i++) {
            for (let j = 1; i + j < n; j++) {
                result[i][j] = this.optimalKODCosts([...result], i, j)
            }
        }
        return result
    }


    // "+" represents a way to combine the values of the subproblems, since we add edge lengths in cost function, we will use "add"
    optimalKODCosts(array, i, j) {

        // we need a global scope array of the clockwise sorted vertices
        // these are clockwise starting with upper left
        // use function this.sortVerticesByPolarAnglesWithVertexClockwise to get them in clockwise polar angle order

        if (j === 1) {
            return 0
        } else {
            let solutions = []
            for (let q = 1; q <= j - 1; q++) {
                // TODO: Check how the array should be handled through the function ( add to graph as property?)
                solutions.push(this.cost(array[i], array[i + q], array[i + j]) + this.optimalKODCosts(array, i, i + q) + this.optimalKODCosts(array, i + q, i + j))
            }
            return Math.min(...solutions)
        }
    }

    // The expression Cost(pi,pi+q,pi+j) denotes the cost of triangle △pi, pi+q, pi+j
    // For now, I set "cost" to the combined edge length
    cost(p1, p2, p3) {
        const cost = this.euclideanDistance2D(p1, p2) + this.euclideanDistance2D(p1, p3) + this.euclideanDistance2D(p2, p3)
        return cost
    }


    // DRAWING

    // For testing, if draw edges Works
    connectConvexHull() {
        let convexHull = this.calculateConvexHull();
        for (let i = 0; i < convexHull.length; i++) {
            if (i === convexHull.length - 1) {
                let currentVertex1 = convexHull[i];
                let nextVertex1 = convexHull[0];
                this.edges.push(new Edge(currentVertex1, nextVertex1));
                break;
            }
            let currentVertex = convexHull[i];
            let nextVertex = convexHull[i + 1];
            this.edges.push(new Edge(currentVertex, nextVertex));
        }
    }
}