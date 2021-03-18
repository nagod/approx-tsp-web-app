let list = []

class Node {
    constructor(xPos, yPos) {
        this.xPos = xPos
        this.yPos = yPos
        this.children = []
        this.parent = []
    }
}
let x = new Node(1, 2)

let y = new Node(1, 2)
//let z = new Node(3, 4)

function add(node, list) {

    let found = list.find(knöten => knöten.xPos === node.xPos && knöten.yPos === node.yPos)
    if (found === undefined) {
        list.push(node)
        return list
    }
}

add(x, list)
add(y, list)
//add(z, list)

class Tupel {
    constructor() {
        this.index = Infinity
        this.vertexOne = {
            xPos: Infinity,
            yPos: Infinity
        }
        this.vertexTwo = {
            xPos: Infinity,
            yPos: Infinity
        }
        this.color = "white"
    }
}
let edgeTupel = []

let tupel = new Tupel()
tupel.index = 0
tupel.vertexOne.xPos = 1
tupel.vertexOne.yPos = 2



tupel.vertexTwo.xPos = 3
tupel.vertexTwo.yPos = 4
edgeTupel.push(tupel)

let z = new Tupel()
z.index = 1
z.vertexOne.xPos = 1
z.vertexOne.yPos = 2

z.vertexTwo.xPos = 99
z.vertexTwo.yPos = 9
edgeTupel.push(z)




function findOccurence(node, tupelList) {

    let index = []
    tupelList.forEach(jackson => {
        if (jackson.vertexOne.xPos === node.xPos && jackson.vertexOne.yPos === node.yPos) {
            index.push(jackson.index)
        } else if (jackson.vertexTwo.xPos === node.xPos && jackson.vertexTwo.yPos === node.yPos) {
            index.push(jackson.index)
        }
    })
    return index
}

let p = findOccurence(x, edgeTupel)
console.log("indices:", p)
console.log("FIND : ", x)
console.log(edgeTupel[p[0]])
console.log(edgeTupel[p[1]])