import Vertex from "./Vertex";
import Edge from "./Edge";
import Observable from "../Architecture/Observable";

export default class Graph extends Observable {
    constructor() {
        super()
        this.vertices = [];
        this.edges = [];
        this.circle = [{ xPos: 0, yPos: 0 }, 0]
        this.orthogonale = []
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
        this.sHullTriangulation = this.sHullTriangulation.bind(this)
        this.sortByDistanceFromPoint = this.sortByDistanceFromPoint.bind(this);
        this.circumCircleRadius = this.circumCircleRadius.bind(this)
        this.smallestCircumCircle = this.smallestCircumCircle.bind(this)
        this.addToSHull = this.addToSHull.bind(this)
        this.addEdgeAsync = this.addEdgeAsync.bind(this)
    }

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
        if (!this.hasVertices()) {
            throw Error("Graph has no vertices");
        }
        return this.vertices.sort((x, y) => x.xPos - y.xPos);
    }

    sortVerticesByYPos() {
        if (!this.hasVertices()) {
            throw Error("Graph has no vertices");
        }
        return this.vertices.sort((x, y) => x.yPos - y.yPos);
    }

    hasEdges() {
        return this.edges.length > 0 ? true : false;
    }

    addEdge(x, y) {
        this.edges.push(new Edge(x, y))
    }

    addEdgeAsync(x, y) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.addEdge(x, y)
                resolve(true)
            }, 1000)
        })
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

    // Returns the polar angle of any vertex with p0 set as origin and vextor representing the x axis direction
    calculatePolarAngle(p0, vertex, vector = { xPos: 1, yPos: 0 }) {
        let point = {
            xPos: vertex.xPos - p0.xPos,
            yPos: vertex.yPos - p0.yPos,
        };
        // p0 will from now on be represented by the x axis vector (1, 0)
        // normalized the point because acos only accepts [-1, 1] as domain
        let normalizedVector = this.normalize(vector)
        let normalizedPoint = this.normalize(point);
        let dotProduct = this.dotProduct2D(normalizedVector, normalizedPoint);
        let result = Math.acos(dotProduct);

        return result;
    }

    dotProduct2D(x, y) {
        return x.xPos * y.xPos + x.yPos * y.yPos;
    }

    // Returns true if point is on the left side of the vector xy
    isLeft(point, x, y) {
        let a = { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
        let b = { xPos: point.xPos - x.xPos, yPos: point.yPos - x.yPos }
        if ((a.xPos * b.yPos - a.yPos * b.xPos) > 0) {
            return true
        }
        return false
    }

    isRight(point, x, y) {
        return !this.isLeft(point, x, y)
    }

    // Returns a vector from vertex x to vertex y
    vectorFromXToY(x, y) {
        return { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
    }

    // Returns the right turned vector
    orthogonalVector(vector) {
        return { xPos: vector.yPos, yPos: -vector.xPos }
    }

    // Length of vector, if no y is specified, it will return length of vector from origin
    euclideanDistance2D(x, y = { xPos: 0, yPos: 0 }) {
        return Math.sqrt(
            Math.pow(x.xPos - y.xPos, 2) + Math.pow(x.yPos - y.yPos, 2)
        );
    }

    // Normalizes a vector x
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

    // Determines if three connected points x, y and z turn counterclockwise
    counterclockwise(x, y, z) {
        return (
            (y.xPos - x.xPos) * (z.yPos - x.yPos) -
            (z.xPos - x.xPos) * (y.yPos - x.yPos)
        );
    }

    // Returns a subset of the gr waphs vertices that build the convex hull.
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
        let stack = [];
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

    // Triangulation 
    // 1) Points are sorted by the distance from the center of the initial circle
    // 2) We determine the polar coordinates of all points in the current convex hull from the point that is to be added
    // 3) Sort them in ascending order
    // 4) Record min and max polar angle of these points
    // 5) Draw an Edge from the new point to every point on the convex hull in counterclockwise order, starting from the max polar angle point
    // 6) Stop at the min polar angle point, every other point lays beyond and is not visible to the added point
    // 7) Remove all points in between min and max and the new added point ( those that you drew edges to )
    // 8) return the new hull


    async sHullTriangulation(set) {

        // Reset edges
        this.edges = []
        let array = [...set]

        // Get any reference Point, it is not stated to be important which point declares the seed
        // Maybe choose mid most point for better runtime
        let referencePoint = array.splice(Math.floor(Math.random() * Math.floor(array.length)), 1)[0]

        // Sort the array by the distance from the reference point
        array = this.sortByDistanceFromPoint(referencePoint, array)

        // Pop the nearest point
        let nearestToReference = array.shift()

        // Find point that creates the smallest circumcircle with referencepoint and the nearest point to it
        let smallestCircumCirclePoint = this.smallestCircumCircle(referencePoint, nearestToReference, array)
        array = array.filter(item => item !== smallestCircumCirclePoint);
        let smallestCircleCenter = this.circumCircleCenter(referencePoint, nearestToReference, smallestCircumCirclePoint)

        // Initialize the convex hull
        let tmpSHull = [referencePoint, nearestToReference, smallestCircumCirclePoint]

        //resort the remaining points according to |xi−C|^2to give points si
        array = this.sortByDistanceFromPoint(smallestCircleCenter, array)

        // Connect initial triangle
        this.edges.push(new Edge(referencePoint, nearestToReference))
        this.edges.push(new Edge(referencePoint, smallestCircumCirclePoint))
        this.edges.push(new Edge(nearestToReference, smallestCircumCirclePoint))

        // We must use a counter variable i and increment it only after the promise, which is adding the point to the current hull, is fulfilled
        let i = 0
        let size = array.length
        while (i < size) {
            let point = array.shift()
            // eslint-disable-next-line no-loop-func
            await this.addToSHull(point, tmpSHull, smallestCircleCenter).then((data) => {
                tmpSHull = data
                i++
            })
        }
    }

    addToSHull(point, hull, circleCenter) {
        return new Promise((resolve, reject) => {

            // We set a timeout to delay the animation
            setTimeout(() => {

                // We calculate a vector to the center of the initial triangle circumcirlce center,
                // from which we calculate the right turned normal vector to determine and sort the
                // hull points by their respective polar angle
                let vectorToCenter = this.vectorFromXToY(point, circleCenter)
                let orthogonal = this.orthogonalVector(vectorToCenter)
                hull = hull.map(item => [item, this.calculatePolarAngle(point, item, orthogonal)])
                hull.sort((a, b) => a[1] - b[1])
                hull = hull.flatMap(item => item[0])

                // Keep track of min and max polar angle - points to the left of the line between min and max vertex 
                // are not visible to the point that is to be added
                let minPolarAngle = hull[0]
                let maxPolarAngle = hull[hull.length - 1]

                // List of vertices that will be contained in the convex hull after point was added
                let removingVertices = []

                for (let item of hull) {
                    if ((item !== minPolarAngle) && (item !== maxPolarAngle)) {
                        // If item is right ( it is visible to the point )
                        if (!this.isLeft(item, maxPolarAngle, minPolarAngle)) {
                            this.edges.push(new Edge(point, item))
                            removingVertices.push(item)
                        }
                    } else if ((item === minPolarAngle) || (item === maxPolarAngle)) {
                        // Add an edge but dont delete the vertices, they are still on the convex hull
                        /*let added = false
                        while (added !== true) {
                            await this.addEdgeAsync(point, item).then((data) => {
                                added = data
                            })
                        }*/
                        this.edges.push(new Edge(point, item))
                    }
                }

                // Remove all points from the hull at once for better runtime
                for (let remove of removingVertices) {
                    hull = hull.filter(element => element !== remove);
                }
                hull.push(point)
                resolve(hull)
            }, 1000) // Make speed dynamic with config
        })
    }


    sortByDistanceFromPoint(x0, array) {
        let result = array.map(point => [point, Math.pow(this.euclideanDistance2D(x0, point), 2)])
        result.sort((a, b) => a[1] - b[1])
        result = result.flatMap(point => point[0])
        return result
    }


    // https://calculator.swiftutors.com/circumcircle-of-a-triangle-calculator.html
    circumCircleRadius(x1, x2, x3) {
        let a = this.euclideanDistance2D(x1, x2)
        let b = this.euclideanDistance2D(x1, x3)
        let c = this.euclideanDistance2D(x2, x3)
        let s = (a + b + c) / 2
        let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
        return result
    }

    smallestCircumCircle(x0, x1, array) {
        let result = [...array]
        result = result.map(point => [point, this.circumCircleRadius(x0, x1, point)])
        result.sort((a, b) => a[1] - b[1])
        //maybe flatmap for style points
        return result[0][0]
    }

    // Approach from "https://www.geeksforgeeks.org/equation-of-circle-when-three-points-on-the-circle-are-given/"
    circumCircleCenter(x1, x2, x3) {

        let x12 = x1.xPos - x2.xPos;
        let x13 = x1.xPos - x3.xPos;
        let y12 = x1.yPos - x2.yPos;
        let y13 = x1.yPos - x3.yPos;
        let y31 = x3.yPos - x1.yPos;
        let y21 = x2.yPos - x1.yPos;
        let x31 = x3.xPos - x1.xPos;
        let x21 = x2.xPos - x1.xPos;

        let sx13 = (Math.pow(x1.xPos, 2) - Math.pow(x3.xPos, 2));
        let sy13 = (Math.pow(x1.yPos, 2) - Math.pow(x3.yPos, 2));
        let sx21 = (Math.pow(x2.xPos, 2) - Math.pow(x1.xPos, 2));
        let sy21 = (Math.pow(x2.yPos, 2) - Math.pow(x1.yPos, 2));

        let f = ((sx13) * (x12) + (sy13) * (x12) + (sx21) * (x13) + (sy21) * (x13)) / (2 * ((y31) * (x12) - (y21) * (x13)));
        let g = ((sx13) * (y12) + (sy13) * (y12) + (sx21) * (y13) + (sy21) * (y13)) / (2 * ((x31) * (y12) - (x21) * (y13)));

        let c = -Math.pow(x1.xPos, 2) - Math.pow(x1.yPos, 2) - 2 * g * x1.xPos - 2 * f * x1.yPos;

        let centerXPos = -g;
        let centerYPos = -f;
        let sqrOfR = centerXPos * centerXPos + centerYPos * centerYPos - c;
        this.circle = [{ xPos: centerXPos, yPos: centerYPos }, Math.sqrt(sqrOfR)]

        return new Vertex(Math.sqrt(sqrOfR), centerXPos, centerYPos)

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