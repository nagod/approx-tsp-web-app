/* eslint-disable no-loop-func */
import Vertex from "./Vertex";
import Edge from "./Edge";
import Triangle from "./Triangle";
import Observable from "../Architecture/Observable";
import MathExtension from "../Extensions/MathExtension"
import Config from "../App/Config";

export default class Graph extends Observable {
    constructor(presenter) {
        super()
        this.presenter = presenter
        this.vertices = [];
        this.edges = [];
        this.triangles = []
        this.mst = []
        this.hasVertices = this.hasVertices.bind(this);
        this.getVertices = this.getVertices.bind(this);
        this.getVertexAtIndex = this.getVertexAtIndex.bind(this);
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

    }

    addVertex(id, xPos, yPos) {
        const vertex = new Vertex(id, xPos, yPos)
        this.vertices.push(vertex);
    }

    makeGraphFromData(vertices) {
        vertices.forEach((vertex) => {
            const { id, xPos, yPos } = vertex
            this.addVertex(id, xPos, yPos);
        });
        let maxX = this.maxXPos(this.vertices)
        let maxY = this.maxYPos(this.vertices)
        this.presenter.scaleCanvasWithVertex(maxX, maxY)


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

    addEdge(x, y) {
        let tmpEdge = new Edge(x, y)
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
                        this.flipEdges(this.triangles)
                    }
                })
            }
        } catch (e) {
            window.alert("Push at least 3 points")
            console.error(e)
        }
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
        // this code part is not executed 

        if (this.eulersFormular() === true) {
            console.log("HOMEBOOY WE GOOD")
        } else {
            console.log("HUSTON WE GOT A PROBLEM")
        }
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
                if (oldEdge.color === Config.defaultEdgeColor) {
                    oldEdge.color = "red"
                } else if (oldEdge.color === "red") {
                    oldEdge.color = "orange"
                } else if (oldEdge.color === "orange") {
                    oldEdge.color = "green" // green is the flipped color also 
                } else if (oldEdge.color === "green") {
                    oldEdge.color = "blue" // flipped twice or looked at 4 times
                }

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
                    newEdge.color = "green"
                    //this.edges.push(newEdge)
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

    // 1) beide verticies in setObjs finden
    // 2) checken ob in selben set
    // 3) falls nicht in gleichen sets
    // 4) beide sets kombinieren, kleineres "löschen"
    // 5) edge in minimumSpannigTree aufnehmen für highligh
    // 6) für alle edges wiederholen => MST

    async kruskal() {



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
        this.mst.forEach(edge => edge.color = "red")
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

}