/* eslint-disable no-loop-func */
import Vertex from "./Vertex";
import Edge from "./Edge";
import Triangle from "./Triangle";
import Observable from "../Architecture/Observable";
import MathExtension from "../Extensions/MathExtension"
import Config from "../App/Config";
import Console from "../View/Console"

export default class Graph extends Observable {
    constructor(presenter) {
        super()
        this.presenter = presenter
        this.vertices = [];
        this.edges = [];
        this.triangles = []
        this.mst = []
        this.shortestTour = []
        this.initialTour = []
        this.tour = null
        this.idCounter = 1
        this.hasVertices = this.hasVertices.bind(this);
        this.getVertices = this.getVertices.bind(this);
        this.getVertexAtIndex = this.getVertexAtIndex.bind(this);
        this.getVertexWithID = this.getVertexWithID.bind(this)
        this.addEdge = this.addEdge.bind(this)
        this.hasEdges = this.hasEdges.bind(this);
        this.getEdges = this.getEdges.bind(this);
        this.sortVerticesByXPos = this.sortVerticesByXPos.bind(this);
        this.sortVerticesByYPos = this.sortVerticesByYPos.bind(this);
        this.calculateConvexHull = this.calculateConvexHull.bind(this);
        this.numberOfEdgesOnConvexHull = this.numberOfEdgesOnConvexHull.bind(this);
        this.addVertex = this.addVertex.bind(this);
        this.makeGraphFromData = this.makeGraphFromData.bind(this);
        this.connectConvexHull = this.connectConvexHull.bind(this);
        this.sHullTriangulation = this.sHullTriangulation.bind(this)
        this.sortByDistanceFromPoint = this.sortByDistanceFromPoint.bind(this);
        this.smallestCircumCircle = this.smallestCircumCircle.bind(this)
        this.addToSHull = this.addToSHull.bind(this)
        this.flipEdge = this.flipEdge.bind(this)
        this.flipEdges = this.flipEdges.bind(this)
        this.sharedTriangles = this.sharedTriangles.bind(this)
        this.sharedEdge = this.sharedEdge.bind(this)
        this.kruskal = this.kruskal.bind(this)
        this.eulersFormular = this.eulersFormular.bind(this)
        this.calculateSkippingTour = this.calculateSkippingTour.bind(this)
        this.mergeTours = this.mergeTours.bind(this)
        this.mergeTourSet = this.mergeTourSet.bind(this)
        this.rotateToFirstId = this.rotateToFirstId.bind(this)
        this.edgeWithEndpointsById = this.edgeWithEndpointsById.bind(this)
        this.highlightTour = this.highlightTour.bind(this)
        this.dfs = this.dfs.bind(this)
        this.deleteVertex = this.deleteVertex.bind(this)
        this.deleteAdjacentEdges = this.deleteAdjacentEdges.bind(this)
        this.tourContainsId = this.tourContainsId.bind(this)
    }

    addVertex(id, xPos, yPos) {
        const vertex = new Vertex(this.idCounter, xPos, yPos)
        this.idCounter += 1
        this.vertices.push(vertex);
    }
    deleteVertex(vertex) {
        let new_vertices = this.vertices.filter(v => (v.id !== vertex.id))
        this.vertices = new_vertices
        this.deleteAdjacentEdges(vertex)
    }

    deleteAdjacentEdges(vertex) {
        // sehr sehr sehr dreckig gecoded, habs anders nicht gerallt lol xd Peppega
        let adj_edges = this.edges.filter(edge => (edge.vertexOne.id === vertex.id) || (edge.vertexTwo.id === vertex.id))
        let finalEdges = []
        this.edges.forEach(edge => {
            if (!(adj_edges.includes(edge))) {
                finalEdges.push(edge)
            }
        })

        this.edges = finalEdges
    }

    makeGraphFromData(vertices) {
        console.log("makeGraphFromData: ", vertices)
        vertices.forEach((vertex) => {
            const { id, xPos, yPos } = vertex
            this.addVertex(id, xPos, yPos);
        });
        let maxX = this.maxXPos(this.vertices)
        let maxY = this.maxYPos(this.vertices)
        //this.presenter.scaleCanvasWithVertex(maxX, maxY)
        this.notify("scalingNotification", [maxX, maxY])
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

    maxXPos(vertices) {
        let tmpVertices = [...vertices]
        let max = Math.max(...tmpVertices.map(element => element.xPos))
        return max
    }
    maxYPos(vertices) {
        let tmpVertices = [...vertices]
        let max = Math.max(...tmpVertices.map(element => element.yPos))
        return max
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

    addEdge(x, y, color = Config.defaultEdgeColor) {
        let tmpEdge = new Edge(x, y)
        tmpEdge.color = color
        this.edges.push(tmpEdge)
        return tmpEdge

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
        result = result.map((x) => [x, MathExtension.calculatePolarAngle(p0, x)]);
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


    sortTrianglesByCircumCircleRadius(triangles) {
        let result = [...triangles]
        result.sort((a, b) => b.circumCircleRadius - a.circumCircleRadius)
        return result
    }

    sortTrianglesByMinAngle(triangles) {
        let result = [...triangles]
        result.sort((a, b) => a.minimumAngle - b.minimumAngle)
        return result
    }

    sortByDistanceFromPoint(x0, array) {
        let result = array.map(point => [point, Math.pow(MathExtension.euclideanDistance2D(x0, point), 2)])
        result.sort((a, b) => a[1] - b[1])
        result = result.flatMap(point => point[0])
        return result
    }


    smallestCircumCircle(x0, x1, array) {
        let result = [...array]
        result = result.map(point => [point, MathExtension.circumCircleRadius(x0, x1, point)])
        result.sort((a, b) => a[1] - b[1])
        //maybe flatmap for style points
        return result[0][0]
    }


    // Returns a vector from vertex x to vertex y
    vectorFromXToY(x, y) {
        return { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
    }

    // Returns the right turned vector
    orthogonalVector(vector) {
        return { xPos: vector.yPos, yPos: -vector.xPos }
    }

    edgeWithEndpoints(a, b) {
        let edge = this.edges.find(edge => (edge.vertexOne === a && edge.vertexTwo === b) || (edge.vertexOne === b && edge.vertexTwo === a))
        if (edge !== undefined) {
            return edge
        } else {
            throw Error("No edge between Endpoints", a, ", ", b)
        }
    }

    edgeWithEndpointsById(a, b) {
        let edge = this.edges.find(edge => (edge.vertexOne.id === a.id && edge.vertexTwo.id === b.id) || (edge.vertexOne.id === b.id && edge.vertexTwo.id === a.id))
        if (edge !== undefined) {
            return edge
        } else {
            throw Error("No edge between Endpoints", a, ", ", b)
        }
    }

    // Returns an array containing the shared triangles of two vertices
    // If the length of the result equals 2 the triangles share an edge that may be flipped
    sharedTriangles(vertexA, vertexB) {
        let result = []
        //Java style
        for (let triangleA of vertexA.triangles) {
            for (let triangleB of vertexB.triangles) {
                if (triangleA === triangleB) {
                    result.push(triangleA)
                }
            }
        }
        return result
    }

    sharedEdge(triangleA, triangleB) {
        let a = [triangleA.vertexOne, triangleA.vertexTwo, triangleA.vertexThree]
        let b = [triangleB.vertexOne, triangleB.vertexTwo, triangleB.vertexThree]

        // C contains vertices that a and b share
        let tmpEdge = []
        for (let vertex of a) {
            for (let vertex2 of b) {
                if (vertex === vertex2) {
                    tmpEdge.push(vertex)
                }
            }
        }
        if (tmpEdge.length !== 2) {
            return false
        }
        return this.edges.find(edge => ((edge.vertexOne === tmpEdge[0] && edge.vertexTwo === tmpEdge[1]) || (edge.vertexOne === tmpEdge[1] && edge.vertexTwo === tmpEdge[0])))
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

    numberOfEdgesOnConvexHull() {
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
        return stack.size;
    }


    // input = edges building hull and edge which needs to be checked 
    // returns true if egde is on Convexhull
    hullContainsEdge(egdesOnHull, edge) {
        let res = []
        egdesOnHull.forEach(element => {
            if (((element.vertexOne.xPos === edge.vertexOne.xPos && element.vertexOne.yPos === edge.vertexOne.yPos) && (element.vertexTwo.xPos === edge.vertexTwo.xPos && element.vertexTwo.yPos === edge.vertexTwo.yPos)) ||
                ((element.vertexOne.xPos === edge.vertexTwo.xPos && element.vertexOne.yPos === edge.vertexTwo.yPos) && (element.vertexTwo.xPos === edge.vertexOne.xPos && element.vertexTwo.yPos === edge.vertexOne.yPos))) {
                res.push(true)
            } else {
                res.push(false)
            }
        })
        return res.includes(true)
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
        try {
            Console.log("Starting Triangulation")
            // Reset edges
            this.edges = []
            this.triangles = []

            for (let vertex of this.vertices) {
                vertex.removeAllTriangles()
            }

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
            let smallestCircleCenter = MathExtension.circumCircleCenter(referencePoint, nearestToReference, smallestCircumCirclePoint)

            // Initialize the convex hull
            let tmpSHull = [referencePoint, nearestToReference, smallestCircumCirclePoint]
            let tmpTriangle = new Triangle(referencePoint, nearestToReference, smallestCircumCirclePoint)
            this.triangles.push(tmpTriangle) // inital, starting triangle 

            referencePoint.triangles.push(tmpTriangle)
            nearestToReference.triangles.push(tmpTriangle)
            smallestCircumCirclePoint.triangles.push(tmpTriangle)

            // Reort the remaining points according to |xi−C|^2to give points sis
            array = this.sortByDistanceFromPoint(smallestCircleCenter, array)

            // Connect initial triangle
            this.edges.push(new Edge(referencePoint, nearestToReference))
            this.edges.push(new Edge(referencePoint, smallestCircumCirclePoint))
            this.edges.push(new Edge(nearestToReference, smallestCircumCirclePoint))

            // Add to inital triangle the initial edgess
            tmpTriangle.edges.push(new Edge(referencePoint, nearestToReference))
            tmpTriangle.edges.push(new Edge(referencePoint, smallestCircumCirclePoint))
            tmpTriangle.edges.push(new Edge(nearestToReference, smallestCircumCirclePoint))
            // We must use a counter variable i and increment it only after the promise, which is adding the point to the current hull, is fulfilled
            let i = 0
            let size = array.length
            while (i < size) {
                let point = array.shift()
                // eslint-disable-next-line no-loop-func
                await this.addToSHull(point, tmpSHull, smallestCircleCenter).then((data) => {
                    tmpSHull = data
                    i++
                    if (i === size) {
                        // Now flip all edges
                        // flipedges returns true when done
                        Console.log("Done")
                        this.flipEdges(this.triangles)
                    }
                })
            }
        } catch (e) {
            window.alert("Push at least 3 points")
            console.error(e)
        }

        //@TODO Async - macht er schon zu früh
        // reset Edge Color
    }

    addToSHull(point, hull, circleCenter) {
        return new Promise(resolve => {

            // We set a timeout to delay the animation
            setTimeout(() => {

                // We calculate a vector to the center of the initial triangle circumcirlce center,
                // from which we calculate the right turned normal vector to determine and sort the
                // hull points by their respective polar angle
                let vectorToCenter = this.vectorFromXToY(point, circleCenter)
                let orthogonal = this.orthogonalVector(vectorToCenter)
                hull = hull.map(item => [item, MathExtension.calculatePolarAngle(point, item, orthogonal)])
                hull.sort((a, b) => a[1] - b[1])
                hull = hull.flatMap(item => item[0])

                // Keep track of min and max polar angle - points to the left of the line between min and max vertex 
                // are not visible to the point that is to be added
                let minPolarAngle = hull[0]
                let maxPolarAngle = hull[hull.length - 1]

                // List of vertices that will be contained in the convex hull after point was added
                let connectedVertices = []

                for (let item of hull) {
                    if ((item !== minPolarAngle) && (item !== maxPolarAngle)) {
                        // If item is right ( it is visible to the point )
                        if (!MathExtension.isLeft(item, maxPolarAngle, minPolarAngle)) {
                            this.edges.push(new Edge(point, item))
                            connectedVertices.push(item)
                        }
                    } else if ((item === minPolarAngle) || (item === maxPolarAngle)) {
                        this.edges.push(new Edge(point, item))
                    }
                }

                // Remove all points from the hull at once for better runtime
                for (let remove of connectedVertices) {
                    hull = hull.filter(element => element !== remove);
                }
                hull.push(point)

                // List of all points that form a new triangle with the point that was just added
                connectedVertices.unshift(minPolarAngle)
                connectedVertices.push(maxPolarAngle)


                for (let i = 0; i < connectedVertices.length - 1; i++) {
                    let tmpTriangle = new Triangle(point, connectedVertices[i], connectedVertices[i + 1])
                    this.triangles.push(tmpTriangle)
                    point.triangles.push(tmpTriangle)
                    connectedVertices[i].triangles.push(tmpTriangle)
                    connectedVertices[i + 1].triangles.push(tmpTriangle)

                    tmpTriangle.edges.push(this.edgeWithEndpoints(point, connectedVertices[i]))
                    tmpTriangle.edges.push(this.edgeWithEndpoints(point, connectedVertices[i + 1]))
                    tmpTriangle.edges.push(this.edgeWithEndpoints(connectedVertices[i], connectedVertices[i + 1]))
                    // Do something with the trianlge
                    // Remove all triangles for edge flipping that share exactly One edge with the final convex hull
                }

                resolve(hull)
                return
            }, Config.baseRateSpeed * 0.7) // Make speed dynamic with config
        })
    }


    async flipEdges(triangles) {
        Console.log("Calculating Delaunay")

        let allTriangles = [...triangles]
        let triangleQueue = []
        let notFinishedWithAllTriangles = true
        while (notFinishedWithAllTriangles) { // Warte, bis alle triangles betrachtet wurden

            let triangleIndex = 0

            while (triangleIndex < allTriangles.length) { // Betrachte alle triangles

                let i = 0
                let visitedAllEdges = false

                let currentTriangle = allTriangles[triangleIndex]

                while (!visitedAllEdges) { // Warte, bis alle edges eines triangles betrachtet wurden
                    while (i < currentTriangle.edges.length) { // Betrachte alle edges
                        // Case that a triangle has no points in it ( Must never be flipped again )
                        if (!(currentTriangle.verticesInCircumCircle(this.vertices).length > 0)) {
                            // Das triangle muss nicht mehr betrachtet werden in Zukunft
                            // Break out of current triangle
                            i = Infinity
                            // Fulfill the waiting promise 
                            visitedAllEdges = true
                            // Look at next triangle
                            triangleIndex++
                        } else {

                            // Find adjacent triangle for current edge
                            let sharedTriangles = this.sharedTriangles(currentTriangle.edges[i].vertexOne, currentTriangle.edges[i].vertexTwo)

                            // Edge is in between of two triangles
                            if (sharedTriangles.length === 2) {


                                await this.flipEdge(sharedTriangles[0], sharedTriangles[1])
                                    .then(data => {
                                        // Add resulting triangles to the queue, if they aren't Delaunay triangles already ( finite )
                                        for (let newTriangle of data) {
                                            // Check if the triangle contains any points in its circumcircle

                                            if (newTriangle.verticesInCircumCircle(this.vertices).length > 0) {
                                                //look at triangle again at some later point - it isn't a delaunay triangle yet
                                                allTriangles.push(newTriangle) // Maybe we should still look at it again only if some other edge has flipped
                                            }
                                        }

                                        for (let index = allTriangles.length; index > 0; index--) {
                                            if (allTriangles[index] === sharedTriangles[0]) {
                                                allTriangles.splice(index, 1);
                                                break
                                            }
                                        }

                                        for (let index = allTriangles.length; index > 0; index--) {
                                            if (allTriangles[index] === sharedTriangles[1]) {
                                                allTriangles.splice(index, 1);
                                                break
                                            }
                                        }

                                        // Break out of loop, old triangle data is corrupted
                                        i = Infinity
                                        // Look at the same index again, filter shifts all remaining indices
                                        visitedAllEdges = true

                                        // Since we flipped and edge and now might have influenced another triangle, look at the queued up triangles again
                                        allTriangles.push(...triangleQueue)
                                        triangleQueue = []


                                    })
                                    .catch(data => {
                                        // Look at next edge
                                        i++
                                        if (i === 3) { // We looked at all edges
                                            // Push old triangle to look at it later (might not be delaunay yet)
                                            triangleQueue.push(currentTriangle)
                                            i = Infinity
                                            // Break out of waiting while
                                            visitedAllEdges = true
                                            //
                                            triangleIndex++
                                        }
                                    })

                                // Else: Current edge is on the convex hull
                            } else {
                                //console.log("If it said before it has an element in it thats bad")
                                // Look at next edge
                                i++
                            }
                        }
                    }
                }
            }
            notFinishedWithAllTriangles = false

        }
        // @TODO: - Async 

        Console.log("Done")
        this.kruskal()
        return true
    }


    // return a promise for animation OR FIND BETTER WAY TO DELAY
    flipEdge(triangleA, triangleB) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let minAngleSoFar = Math.min(triangleA.minimumAngle, triangleB.minimumAngle)
                let a = [triangleA.vertexOne, triangleA.vertexTwo, triangleA.vertexThree]
                let b = [triangleB.vertexOne, triangleB.vertexTwo, triangleB.vertexThree]

                // C contains vertices that a and b share
                let c = []
                for (let vertex of a) {
                    for (let vertex2 of b) {
                        if (vertex === vertex2) {
                            c.push(vertex)
                        }
                    }
                }
                // determine old edge
                let oldEdge = this.sharedEdge(triangleA, triangleB)
                /*if (oldEdge.color === Config.defaultEdgeColor) {
                    oldEdge.color = "red"
                } else if (oldEdge.color === "red") {
                    oldEdge.color = "orange"
                } else if (oldEdge.color === "orange") {
                    oldEdge.color = "green" // green is the flipped color also 
                } else if (oldEdge.color === "green") {
                    // oldEdge.color = "blue" // flipped twice or looked at 4 times
                }*/

                //check if

                // Triangles arent adjacent
                // Error handling
                if (c.length !== 2) {
                    //reject([triangleA, triangleB])
                    reject("Triangles arent adjacent")
                    return
                }

                // a without b, b without a ( difference )
                // elements that dont share the triangle
                for (let vertex of c) {
                    a = a.filter(element => element !== vertex)
                    b = b.filter(element => element !== vertex)
                }
                // Check if an edge flip would result in a valid triangulation ( both are left or both are right to the new edge)
                if ((MathExtension.isLeft(c[0], a[0], b[0]) && MathExtension.isLeft(c[1], a[0], b[0])) || (!MathExtension.isLeft(c[0], a[0], b[0]) && !MathExtension.isLeft(c[1], a[0], b[0]))) {
                    reject([triangleA, triangleB])
                    return
                }
                // Calculate resulting min angle
                let tmpA = new Triangle(a[0], b[0], c[0])
                let tmpB = new Triangle(a[0], b[0], c[1])



                let newMinAngle = Math.min(tmpA.minimumAngle, tmpB.minimumAngle)
                if (newMinAngle > minAngleSoFar) { // New triangles are better

                    tmpA.edges.push(this.edgeWithEndpoints(a[0], c[0]))
                    tmpA.edges.push(this.edgeWithEndpoints(b[0], c[0]))

                    tmpB.edges.push(this.edgeWithEndpoints(a[0], c[1]))
                    tmpB.edges.push(this.edgeWithEndpoints(b[0], c[1]))


                    // Remove old triangles
                    this.triangles = this.triangles.filter(triangle => triangle !== triangleA)
                    this.triangles = this.triangles.filter(triangle => triangle !== triangleB)

                    // Remove triangles from all vertices, including a, b and c
                    triangleA.vertexOne.removeTriangle(triangleA)
                    triangleA.vertexTwo.removeTriangle(triangleA)
                    triangleA.vertexThree.removeTriangle(triangleA)
                    triangleB.vertexOne.removeTriangle(triangleB)
                    triangleB.vertexTwo.removeTriangle(triangleB)
                    triangleB.vertexThree.removeTriangle(triangleB)

                    // Remove old edge
                    this.edges = this.edges.filter(edge => edge !== oldEdge)
                    triangleA.edges = triangleA.edges.filter(edge => edge !== oldEdge)
                    triangleB.edges = triangleB.edges.filter(edge => edge !== oldEdge)

                    oldEdge = null

                    triangleA.vertexOne = null
                    triangleA.vertexTwo = null
                    triangleA.vertexThree = null
                    triangleB.vertexOne = null
                    triangleB.vertexTwo = null
                    triangleB.vertexThree = null




                    // Push new triangles to old vertices
                    this.triangles.push(tmpA, tmpB)
                    a[0].triangles.push(tmpA, tmpB)
                    b[0].triangles.push(tmpA, tmpB)
                    c[0].triangles.push(tmpA)
                    c[1].triangles.push(tmpB)




                    // Push new edge
                    let newEdge = this.addEdge(a[0], b[0])
                    //newEdge.color = "green"
                    tmpA.edges.push(newEdge)
                    tmpB.edges.push(newEdge)

                    resolve([tmpA, tmpB])
                    return
                }
                reject([triangleA, triangleB])
                return
            }, Config.baseRateSpeed * 0.2)
        })
    }

    // 1) beide vertices in setObjs finden
    // 2) checken ob in selben set
    // 3) falls nicht in gleichen sets
    // 4) beide sets kombinieren, kleineres "löschen"
    // 5) edge in minimumSpannigTree aufnehmen für highligh
    // 6) für alle edges wiederholen => MST

    async kruskal() {
        Console.log("Calculating MST")
        // reset egdge color
        this.edges.forEach(n => n.color = Config.defaultEdgeColor)
        // initial datastructures 
        let listOfsets = []
        // compare obj
        this.vertices.forEach((vertex, index) => {
            let setObject = {
                id: index,
                obj: [
                    {
                        xPos: vertex.xPos,
                        yPos: vertex.yPos
                    }
                ]
            }
            listOfsets.push(setObject)
        })


        //sort edges by length
        let edges = this.edges.sort((a, b) => a.length - b.length)

        // check for all edges 
        let edgeIndex = 0;
        while (edgeIndex < edges.length) {
            let edgeVertex1 = edges[edgeIndex].vertexOne
            let edgeVertex2 = edges[edgeIndex].vertexTwo

            let setIndexOne = null
            let setIndexTwo = null

            await MathExtension.find(edgeVertex1, listOfsets).then(data => {
                setIndexOne = data
            }).catch(data => setIndexOne = data)

            await MathExtension.find(edgeVertex2, listOfsets).then(data => {
                setIndexTwo = data
            }).catch(data => setIndexTwo = data)



            // 
            if (setIndexOne === null || setIndexTwo === null) {
                edgeIndex++
                console.log("kann doch nicht sein")
            } else {
                // both vertices have been found in listOfsets with their setID
                // if their setID´s are unequal => merge the sets together 
                // current Edge is part of MST edges
                if (setIndexOne !== setIndexTwo) {
                    if (listOfsets[setIndexOne].obj.length > listOfsets[setIndexTwo].obj.length) {
                        listOfsets[setIndexOne].obj = MathExtension.union(listOfsets[setIndexOne].obj, listOfsets[setIndexTwo].obj)[0]
                        listOfsets[setIndexTwo].obj = MathExtension.union(listOfsets[setIndexOne].obj, listOfsets[setIndexTwo].obj)[1]
                    } else {
                        listOfsets[setIndexTwo].obj = MathExtension.union(listOfsets[setIndexTwo].obj, listOfsets[setIndexOne].obj)[0]
                        listOfsets[setIndexOne].obj = MathExtension.union(listOfsets[setIndexOne].obj, listOfsets[setIndexTwo].obj)[1]

                    }
                    this.mst.push(edges[edgeIndex])
                    edgeIndex++
                } else {
                    edgeIndex++
                }
            }
        }
        // mark mst route
        this.mst.forEach(edge => edge.color = "red")
        //@TODO Async
        Console.log("Done")
        this.dfs()
    }

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

    //Any triangulation of a set P ⊂ R2 of n points has exactly 3n−h−3 edges, where h is the number of points from P on ∂conv(P)
    eulersFormular() {
        let n = this.vertices.length
        let convexHull = this.calculateConvexHull();
        let h = convexHull.length   //this.numberOfEdgesOnConvexHull()
        let eulerNumber = 3 * n - h - 3

        console.log("N : ", n, "H : ", h)
        console.log("eulerNumber 3 * n - h - 3 : ", eulerNumber)
        if (this.edges.length === eulerNumber) {
            console.log("#edges:", this.edges.length)
            return true
        } else {
            console.log("PROBLEM #edges:", this.edges.length)

            return false
        }
        //return this.edges.count === eulerNumber ? true : false

    }
    async euleTour() {
        // DFS
        // jumpen 
    }

    dfs() {
        try {
            Console.log("Calculating Euler Tour")
            this.tour = MathExtension.dfsTour(this.mst)
            console.log(this.tour)
            Console.log("Done")
            this.calculateSkippingTour(this.tour)
        } catch (e) {
            console.log(e)
        }

    }


    // New approach while playing around: Skipping turned out to be just valid and equal when the subsequence that is skipped 



    // What do we do here: We first take the array in preorder and make an eulertour out of it
    // We do this by taking an empty array and pushing an element to it that is not yet contained in it => 
    // This is like pseudo deleting every additional instance of the node
    // Then we rotate the array by any desired degree, like the first instance of a node that is on the convex hull
    // With this rotated array and every other rotation we make another eulertour. Then we have an array of different eulertours, 
    // After we check if those are legit
    calculateSkippingTour(preorderArray) {
        Console.log("Using Leaf Skipping Algorithm")
        let preorder = [...preorderArray]
        let validEulertour = []
        // head is neede at end

        // Inital euler tour
        preorder.forEach(element => {
            if (!validEulertour.includes(element)) {
                validEulertour.push(element)
            }
        })

        let initTour = [...validEulertour]
        this.initialTour = initTour

        console.log("Initial tour! of length: ", this.tourLength(validEulertour, true))
        console.log("With nodes: ", validEulertour.length)

        // Find out how many points are on the convex hull. Because the tour is a curcuit, the number of possible skips
        // is equal to the number of points on the convex hull. You could also do that with the "isLeaf" property which equals Children.length = 0

        let leafCount = 0
        preorder.forEach(element => {
            if (element.children.length === 0) { // Changed for element.isOnConvexHull
                element.isLeaf = true // isLeaf
                leafCount += 1
            }
        })


        let allValidTours = [validEulertour]


        let rotation = [...preorder]


        //
        // TODO: Test the for loop, could not do it yet because there were no nodes on the convex hull
        //

        // What does this loop do?
        // This acts on the mst tour which is 2 length of mst. Nodes can still appear many times
        for (let i = 0; i < leafCount; i++) { // maybe - 1 leaf count
            // Make a copy of preorder

            let ogversion = [...rotation]
            // And another one to play with - for tmp stuff
            let tmpRotation = [...rotation]

            // Find first index of element on convex hull
            let firstIndex = tmpRotation.findIndex(element => element.isLeaf)
            //Remove it and every other item before it and call it head.
            let withoutHead = [...tmpRotation]
            withoutHead.splice(0, firstIndex + 1)

            // Find index of list without head. Need to add something to it.
            let secondIndex = withoutHead.findIndex(element => element.isLeaf) // exchanged for element.isOnConvexHull

            if (!(secondIndex === -1)) {

                //
                // Handle case where no second index is found. This means
                // that there is no leaf left and we should handle it somehow
                //
                //



                // Hier indexspielerei prüfen
                // Add the oder indices so that we find the index from the original list without the removed head.
                secondIndex += (firstIndex + 1)
                // Now first and second index represent the indices of the first two elements that are on the convex hull.
                let spliceIndex = firstIndex + 1
                let count = secondIndex - spliceIndex
                /// Remove everything in the tmp rotation in between first and second index
                let withSkipping = [...ogversion]
                withSkipping.splice(spliceIndex, count)
                // Congratz, you now have a list that does not contain items between the first two points on the convex hull.
                // Now need to check if a resulting eulertour would still be valid, we can do this by checking its length against the validEulerTour
                let tour = []
                withSkipping.forEach(element => {
                    if (!tour.includes(element)) {
                        tour.push(element)
                    }
                })
                if (tour.length === validEulertour.length) { // Tour is not valid if it doesnt contain all nodes
                    allValidTours.push(tour)
                }

                // We pushed a new tour from the ogversion. Now rotate the OGTour like a barrelshifter and go to next iteration

                let head = []
                for (let k = 0; k < spliceIndex; k++) { // Remove everything up to the splice index
                    head.push(ogversion.shift())
                }
                // And push it to the end to get a rotation
                head.forEach(node => ogversion.push(node))

                // Set rotation to ogversion
                rotation = ogversion
            } else { console.log("Not using this one") }
        }
        /*
        allValidTours.forEach(attr => {
            console.log("Found a tour with first element", attr[0])
        })*/


        // Now I have all valid eulertours in an array callded "allValidTours"
        console.log("Finished rotating and skipping all tours, now starting Merge")
        this.mergeTourSet(allValidTours)
        // allValidTours
        Console.log("Done")
        // => First, find the shortest of those tours.
        // I think this shortest tour should be the "base" tour to improve upon. It could be the case that merging 2 longer tours
        // result in a tour that is ultimately shorter but guess what I dont care.
        // TODO: Make some tea and think of a good way to merge these tours.

    }


    // Merges a Set of tours to a final shortest tour
    mergeTourSet(tours) {
        let tmpTours = [...tours]
        // Rotate every so that id 0 is at first index. This makes it easier to compare and merge them.
        console.log("Got ", tmpTours.length, " tours to merge!")
        for (let tour of tmpTours) {
            tour = this.rotateToFirstId(tour)
        }
        tmpTours.sort((a, b) => this.tourLength(a, true) - this.tourLength(b, true))
        // Now I should have all tours sorted by length. Now take the first one and merge them all.
        let shortestTour = tmpTours.shift()
        for (let tour of tmpTours) {
            // @Deniz: @EDIT: glaube habe es gefixed, war ein error mit splice und dann hat er einfach ein array verändert auf das
            // er eig nicht mehr hätte zugreifen sollen aber was auch immer..... habe jetzt einige male getestet und immer ohne
            // Error, dafür ist das ergebnis teilweise nicht mehr so krass wie erhofft..
            shortestTour = this.mergeTours(shortestTour, tour)
        }
        console.log("Got the shortest tour!")
        console.log("it is of length: ", this.tourLength(shortestTour, true))
        Console.log(`Length after Skipping: ${this.tourLength(shortestTour, true)}`)

        Console.log(`Length after Skipping: ${this.tourLength(shortestTour, true)}`)
        this.shortestTour = shortestTour
        return shortestTour
    }

    // Idea, iterate though both lists and stop, when sID at index+1 is not equal. Remember index
    // Then find second index of both tours where two IDs are equal again. ( With different ID's in between)
    // Calculate this.tourLength of the two subsequences and compare them.
    // If b's subsequence lenght is shorter, substitute a's subsequence with b's subsequence
    // Repeat above for other subsequences
    // Return a which represents the shortest subsequences
    mergeTours(tourA, tourB) {
        let a = [...tourA]
        let b = [...tourB]
        if (a.length !== b.length) {
            console.log("ERROR: One tour was shorter! -> Return ")
            return tourA
        }
        let indexOne = 0
        if (a[indexOne].id !== b[indexOne].id) {
            console.log("ERROR: Both tours did not have same first index")
            return tourA
        }
        while (a[indexOne].id === b[indexOne].id) { indexOne++ }
        let indexTwo = indexOne
        indexOne -= 1 // Last index where both tours are equal
        while (a[indexTwo].id !== b[indexTwo].id) {
            indexTwo++
            if (indexTwo === a.length || indexTwo === b.length) {
                console.log("ERROR: Both tours were not of the same length! -> Return")
                return tourA
            }
        }
        let subsequenceLength = indexTwo - (indexOne + 1)
        let subsequenceA = a.splice(indexOne + 1, subsequenceLength)
        let subsequenceB = b.splice(indexOne + 1, subsequenceLength)
        if (this.tourLength(subsequenceA) > this.tourLength(subsequenceB)) {
            a.splice(indexOne + 1, 0, ...subsequenceB)
            // Case where the subsequence elements were the only node occuring in the tour
            // Now test if a still contains all elements from subsequence A
            subsequenceA.forEach(node => {
                if (!this.tourContainsId(a, node.id)) {
                    console.log("ERROR: Merger Tour would not have all Elements!")
                    return tourA
                }
            })
        }
        console.log("Successfully merged two Tours! End of Function")
        return tourA
    }

    tourContainsId(tour, id) {
        if (tour.find(node => node.id === id) === undefined) {
            return false
        } else {
            return true
        }
    }

    // @TODO: Take care! What is going to happen if someone deletes node with id1? => Find lowest ID

    // Should work just fine
    // Accepts array of Node objects and barell shifts it until the first Node is of Index 0 
    rotateToFirstId(tour) {
        let hasIdOne = false
        for (let node of tour) {
            if (node.id === 1) {
                hasIdOne = true
            }
        }
        if (!hasIdOne) {
            console.log("ERROR: No node of index 0 found")
            return tour
        }
        while (tour[0].id !== 1) {
            tour.push(tour.shift())
        }
        return tour
    }

    // returns the length of a given tour of Vertices in an array

    tourLength(tour, isCycle = false) {
        let count = tour.length
        let length = 0
        for (let index = 0; index < count - 1; index++) {
            length += MathExtension.euclideanDistance2D(tour[index], tour[index + 1])
        }
        if (isCycle) {
            length += MathExtension.euclideanDistance2D(tour[count - 1], tour[0])
        }
        return length
    }

    highlightTour(tour, color) {
        console.log("Highlighting tour with nodes of count: ", tour.length)
        for (let i = 0; i < tour.length; i++) {
            if (i === tour.length - 1) {
                let nodeA1 = tour[i]
                let nodeA2 = tour[0]
                try {
                    let edge = this.edgeWithEndpointsById(nodeA1, nodeA2)
                    edge.color = color
                } catch {
                    let v1 = this.getVertexWithID(nodeA1.id)
                    let v2 = this.getVertexWithID(nodeA2.id)
                    this.addEdge(v1, v2, color)
                }
            } else {
                let nodeA1 = tour[i]
                let nodeA2 = tour[i + 1]
                try {
                    let edge = this.edgeWithEndpointsById(nodeA1, nodeA2)
                    edge.color = color
                } catch {
                    let v1 = this.getVertexWithID(nodeA1.id)
                    let v2 = this.getVertexWithID(nodeA2.id)
                    this.addEdge(v1, v2, color)
                }
            }
        }
    }


}