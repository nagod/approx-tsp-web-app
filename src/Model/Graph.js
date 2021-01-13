import Vertex from "./Vertex";
import Edge from "./Edge";
import Triangle from "./Triangle";
import Observable from "../Architecture/Observable";
import MathExtension from "../Extensions/MathExtension"
import Config from "../App/Config";

export default class Graph extends Observable {
    constructor() {
        super()
        this.vertices = [];
        this.edges = [];
        this.triangles = []
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
        this.smallestCircumCircle = this.smallestCircumCircle.bind(this)
        this.addToSHull = this.addToSHull.bind(this)
        this.addEdgeAsync = this.addEdgeAsync.bind(this)
        this.flipEdge = this.flipEdge.bind(this)
        this.flipEdges = this.flipEdges.bind(this)
        this.sharedTriangles = this.sharedTriangles.bind(this)
        this.sharedEdge = this.sharedEdge.bind(this)
    }

    addVertex(vertex) {
        this.vertices.push(vertex)
    }

    addVertexFromData(id, xPos, yPos) {
        const vertex = new Vertex(id, xPos, yPos)
        this.vertices.push(vertex);
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
        let tmpEdge = new Edge(x, y)
        this.edges.push(tmpEdge)
        return tmpEdge

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


    // Returns a vector from vertex x to vertex y
    vectorFromXToY(x, y) {
        return { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
    }

    // Returns the right turned vector
    orthogonalVector(vector) {
        return { xPos: vector.yPos, yPos: -vector.xPos }
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
        return this.edges.find(edge => ((edge.vertexOne === tmpEdge[0] || edge.vertexOne === tmpEdge[1]) && (edge.vertexTwo === tmpEdge[0] || edge.vertexTwo === tmpEdge[1])))
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
        this.triangle = []
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
        let tmpTriangle = new Triangle(referencePoint, nearestToReference, smallestCircumCirclePoint)
        this.triangles.push(tmpTriangle)
        referencePoint.triangles.push(tmpTriangle)
        nearestToReference.triangles.push(tmpTriangle)
        smallestCircumCirclePoint.triangles.push(tmpTriangle)

        // Resort the remaining points according to |xi−C|^2to give points si
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
                if (i === size) {
                    // Now flip all edges
                    this.flipEdges(this.triangles)
                }
            })
        }
        console.log("ende")
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
                    // Do something with the trianlge

                    //point.triangles.push(triangle)
                    //connectedVertices.push(triangle)
                    // Remove all triangles for edge flipping that share exactly One edge with the final convex hull
                }

                resolve(hull)
                return
            }, 200) // Make speed dynamic with config
        })
    }

    // Flip all edges until either every edge was flipped or the triangulation meets delaunays criteria 
    async flipEdges(triangles) {

        let sortedTriangles = this.sortTrianglesByMinAngle(triangles)
        console.log(sortedTriangles, "should not be empty")
        let smallest = sortedTriangles[0]
        let smallestTriangleEdges = smallest.getEdges(this.edges)

        console.log("triangle size smallest", smallestTriangleEdges.length, smallestTriangleEdges)


        let i = 0
        let resolveCounter = 0
        let size = smallestTriangleEdges.length
        while (i < size) {
            let tmpEdge = smallestTriangleEdges[i]
            let a = tmpEdge.vertexOne
            let b = tmpEdge.vertexTwo
            let commonTriangles = this.sharedTriangles(a, b)
            if (commonTriangles.length === 2) {
                // eslint-disable-next-line no-loop-func
                await this.flipEdge(commonTriangles[0], commonTriangles[1]).then(data => {
                    console.log("then")
                    resolveCounter++
                    i++
                    console.log(i)
                    if (i === size) {
                        // Now flip all edges
                        if (resolveCounter === 0) {
                            console.log(resolveCounter)
                            return
                        } else {
                            console.log("about to start a new flip Edges call")
                            this.flipEdges(this.triangles)
                        }
                    }
                }// eslint-disable-next-line no-loop-func
                ).catch(data => {
                    console.log("catch")
                    i++
                    console.log(i)
                    if (i === size) {
                        if (resolveCounter === 0) {
                            console.log(resolveCounter)
                            return
                        } else {
                            console.log("about to start a new flip Edges call")
                            this.flipEdges(this.triangles)
                        }
                    }
                })
            }
        }

        console.log("print just anythin")
    }






    /*
            /// OLD
            let tmpEdgeList = []
            for (let edge of edges) {
                let a = edge.vertexOne
                let b = edge.vertexTwo
                let commonTriangles = this.sharedTriangles(a, b)
                //console.log("common triangles: ", commonTriangles)
                if (commonTriangles.length === 2) {
                    //console.log("make edge blue!")
                    await this.flipEdge(commonTriangles[0], commonTriangles[1]).then(
                        // really doesnt matter what happens here, edges was flipped and can be ignored now
                    ).catch(data => {
                        if (data) { tmpEdgeList.push(data) }
                    })
                }
            }
            // Some edges were flipped, now look if any edge that hadn't been flipped until now again
            if (tmpEdgeList.length !== edges.length) {
                this.flipEdges(tmpEdgeList)
            } else {
                console.log("finished")
            }
    */

    // return a promise for animation OR FIND BETTER WAY TO DELAY
    flipEdge(triangleA, triangleB) {
        return new Promise((resolve, reject) => {
            console.log("visited flip edge function")
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
                            //console.log("gemacht", vertex, vertex2)
                        }
                        else {
                            //console.log("nicht gleich", vertex, vertex2)
                        }
                    }
                }

                // 
                let oldEdge = this.sharedEdge(triangleA, triangleB)
                //oldEdge.color = "blue"

                // Triangles arent adjacent
                // Error handling
                if (c.length !== 2) {
                    console.log("rejecting", oldEdge)
                    reject(oldEdge)
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
                    console.log("rejecting", oldEdge)
                    reject(oldEdge)
                    return
                }
                // Calculate resulting min angle
                let tmpA = new Triangle(a[0], b[0], c[0])
                let tmpB = new Triangle(a[0], b[0], c[1])

                let newMinAngle = Math.min(tmpA.minimumAngle, tmpB.minimumAngle)

                if (newMinAngle > minAngleSoFar) { // New triangles are better

                    // Remove old triangles
                    this.triangles = this.triangles.filter(triangle => triangle !== triangleA)
                    this.triangles = this.triangles.filter(triangle => triangle !== triangleB)

                    // Remove old edge
                    this.edges = this.edges.filter(edge => edge !== oldEdge)

                    // Remove triangles from all vertices, including a, b and c
                    triangleA.vertexOne.removeTriangle(triangleA)
                    triangleA.vertexTwo.removeTriangle(triangleA)
                    triangleA.vertexThree.removeTriangle(triangleA)
                    triangleB.vertexOne.removeTriangle(triangleB)
                    triangleB.vertexTwo.removeTriangle(triangleB)
                    triangleB.vertexThree.removeTriangle(triangleB)


                    // Push new triangles to old vertices
                    this.triangles.push(tmpA, tmpB)
                    a[0].triangles.push(tmpA, tmpB)
                    b[0].triangles.push(tmpA, tmpB)
                    c[0].triangles.push(tmpA)
                    c[1].triangles.push(tmpB)


                    // Push new one
                    let newEdge = this.addEdge(a[0], b[0])
                    if (oldEdge.color === Config.defaultEdgeColor) {
                        newEdge.color = "orange"
                    } else if (oldEdge.color === "orange") {
                        newEdge.color = "yellow"
                    } else if (oldEdge.color === "yellow") {
                        newEdge.color = "red"
                    }


                    console.log("resolving", oldEdge)
                    resolve(newEdge)
                    return
                }
                reject(oldEdge)
                console.log("rejecting", oldEdge)
                return
            }, 200)
        })
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