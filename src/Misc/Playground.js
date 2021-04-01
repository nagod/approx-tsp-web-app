class Node {
    constructor(xPos, yPos, id) {
        this.id = id
        this.xPos = xPos
        this.yPos = yPos
        this.children = {
            left: [],
            right: []
        }
        this.parent = []
        this.isOnConvexHull = false
        this.visited = false
        this.polarAngle = null
    }
}

let node2 = new Node(1, 2, 99)
let node3 = new Node(1, 1, 29)

node2.children.left.push(node3)

let visiter = node2
let token = true
while (token) {
    console.log(visiter.id)
    if (visiter.children.left[0] !== undefined) {
        visiter = visiter.children.left[0]
    } else {
        token = false
    }

}
console.log(visiter.id)