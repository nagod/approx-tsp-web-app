

class Vertex {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
    }
}

console.log("*******************\n**** NEW PROGRAM RUN ****\n*********************")


// IMplementing the "s-hull algorithm"
function sHullTriangulation(array) {
    let array = [new Vertex(1, 1, 1), new Vertex(2, 3, 5), new Vertex(3, 3, 3),
    new Vertex(4, 5, 2), new Vertex(5, 6, 8), new Vertex(6, 7, 5)]
    console.log("\n\nStarting with: ", array)

    // Get any reference Point, it is not stated to be important which point declares the seed
    let referencePoint = array.shift()
    console.log("\n\nReference Point is: ", referencePoint)

    // Sort the array by the distance from the reference point
    array = sortByDistanceFromPoint(referencePoint, array)
    console.log("\n\nArray sorted by distance from point is: ", array)

    // Pop the nearest point
    let nearestToReference = array.shift()
    console.log("\n\nNearest point to reference point is: ", nearestToReference)
    // Find point that creates the smallest circumcircle with referencepoint and the nearest point to it

    let smallestCircumCirclePoint = smallestCircumCircle(referencePoint, nearestToReference, array)
    console.log("\n\nSmallest circumcircle point is: ", smallestCircumCirclePoint)

    let smallestCircleCenter = circumCircleCenter(referencePoint, nearestToReference, smallestCircumCirclePoint)
    console.log("\n\nCenter of smallestCircle: ", smallestCircleCenter)


    //order points [referencePoint, nearestToReference, smallestCircleCenter] to give a right handed system: this is the initialseed convex hull.
    console.log("referencePoint :", referencePoint.xPos, referencePoint.yPos)
    console.log("nearestToReference: ", nearestToReference.xPos, nearestToReference.yPos)
    console.log("smallestCircleCenter :", smallestCircleCenter.xPos, smallestCircleCenter.yPos)

    //resort the remaining points according to |xi−C|^2to give points si
    array = sortByDistanceFromPoint(smallestCircleCenter, array)
    console.log("\n\nArray resorted by distance from ReferencePoint to smallestCircleCenter is: ", array)


    // Add edges between initial triangle

}

function euclideanDistance2D(x, y = { xPos: 0, yPos: 0 }) {
    return Math.sqrt(
        Math.pow(x.xPos - y.xPos, 2) + Math.pow(x.yPos - y.yPos, 2)
    );
}

function sortByDistanceFromPoint(x0, array2) {
    let result = array2.map(point => [point, Math.pow(euclideanDistance2D(x0, point), 2)])
    result.sort((a, b) => a[1] - b[1])
    result = result.flatMap(point => point[0])
    return result
}


//https://calculator.swiftutors.com/circumcircle-of-a-triangle-calculator.html
function circumCircleRadius(x1, x2, x3) {
    let a = euclideanDistance2D(x1, x2)
    let b = euclideanDistance2D(x1, x3)
    let c = euclideanDistance2D(x2, x3)
    let s = (a + b + c) / 2
    let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
    return result
}

function smallestCircumCircle(x0, x1, array3) {
    let result = array3.map(point => [point, circumCircleRadius(x0, x1, point)])
    result.sort((a, b) => a[1] - b[1])
    return result[0][0]
}
// Approach from "https://www.geeksforgeeks.org/equation-of-circle-when-three-points-on-the-circle-are-given/"
function circumCircleCenter(x1, x2, x3) {

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
    return new Vertex(Math.sqrt(sqrOfR), centerXPos, centerYPos)


}