const fs = require('fs');
// const { normalize } = require('path');
// Proper way to copy an array in Javascript
/*var array  = [1, 2, 3]
var result = [...array]
result.pop()
console.log(array)
console.log(result)*/

function calculatePolarAngle(p0, vertex) {
    console.log("calulatepolaarangle")
    console.log(p0, "is p0")
    console.log(vertex)
    var point = {
        xPos: vertex.xPos - p0.xPos,
        yPos: vertex.yPos - p0.yPos
    }
    console.log(point, "is point")
    // I dont need this anymore, point will always be 0, 1 from now on which represents the x axis from a given point
    //var normalizedP0 = normalize(p0)
    var normalizedPoint = normalize(point)
    console.log(normalizedPoint, "is normalized point")
    //console.log(normalizedP0, "is normalizedP0")

    var dotProduct = dotProduct2D({ xPos: 1, yPos: 0 }, normalizedPoint)
    console.log(dotProduct, "is dot product")
    var result = Math.acos(dotProduct)
    console.log(result, "is result")
    return result
}

function dotProduct2D(x, y) {
    return x.xPos * y.xPos + x.yPos * y.yPos
}
function euclideanDistance2D(x, y = { xPos: 0, yPos: 0 }) {
    return Math.sqrt(Math.pow(x.xPos - y.yPos, 2) + Math.pow(x.yPos - y.yPos, 2))
}

function normalize(x) {
    var length = euclideanDistance2D(x)
    if (length === 0) {
        return x
    } else {
        return {
            xPos: x.xPos / length,
            yPos: x.yPos / length
        }
    }
}


function sortVerticesByPolarAnglesWithVertex(p0, vertices) {
    var result = [...vertices]
    console.log(result)
    console.log(p0, "is p0")
    //calculatePolarAngle(p0, result[0])
    console.log("before map")
    result = result.map(x => [x, calculatePolarAngle(p0, x)])
    console.log(result)
    result = result.sort((x, y) => x[1] - y[1])
    console.log(result)
    result = result.flatMap(x => x[0])
    return result
}

var origin = { xPos: 0, yPos: 0 }
var p0 = { xPos: 0, yPos: 0 }
var vertices = [
    { xPos: 1, yPos: 3 },  // should be 3rd
    { xPos: -1, yPos: 3 }, // shuld be 4th
    { xPos: 1, yPos: 2 }, // shold be second
    { xPos: 1, yPos: 1 }] // should be first



console.log(sortVerticesByPolarAnglesWithVertex(p0, vertices))
/*
const fs = require('fs');
let files = fs.readdirSync("src/Ressources/Examples").filter((a) => {
    return a != ".DS_Store"
})

console.log(files)*/