class Vertex {
    constructor(id, xPos, yPos) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
    }
}
class Edge {

    constructor(vertex1, vertex2) {
        this.vertexOne = vertex1;
        this.vertexTwo = vertex2;
    }
}

let v1 = new Vertex(1, 1, 1)
let v2 = new Vertex(2, 2, 2)
let v3 = new Vertex(3, 3, 3)
let v4 = new Vertex(4, 4, 4)

let e1 = new Edge(v1, v2)
let e2 = new Edge(v1, v3)
let e3 = new Edge(v2, v3)
let e4 = new Edge(v2, v4)
let t = [e1, e2, e3]


function checkEdgeOnHull(egdesOnHull, edge) {
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

console.log(checkEdgeOnHull(t, e4))
