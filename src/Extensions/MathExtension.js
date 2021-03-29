//TODO look up how to export this properly so that it extends the global object math
class Node {
    constructor(xPos, yPos, id) {
        this.id = id
        this.xPos = xPos
        this.yPos = yPos
        this.children = []
        this.parent = []
        this.isOnConvexHull = false
        this.visited = false
        this.polarAngle = null
    }
}
class Tupel {
    constructor() {
        this.index = Infinity
        this.vertexOne = {
            id: Infinity,
            xPos: Infinity,
            yPos: Infinity
        }
        this.vertexTwo = {
            id: Infinity,
            xPos: Infinity,
            yPos: Infinity
        }
        this.color = "white"
    }
}
export default class MathExtension {


    static euclideanDistance2D = function (x, y = { xPos: 0, yPos: 0 }) {
        return Math.sqrt(
            Math.pow(x.xPos - y.xPos, 2) + Math.pow(x.yPos - y.yPos, 2)
        );
    }

    static angle(x, y) {
        let scalar = this.dotProduct2D(this.normalize(x), this.normalize(y))
        return Math.acos(scalar) * 180 / Math.PI
    }

    static dotProduct2D(x, y) {
        return x.xPos * y.xPos + x.yPos * y.yPos;
    }

    static normalize(x) {
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

    // Returns true if point is on the left side of the vector xy
    static isLeft(point, x, y) {
        let a = { xPos: y.xPos - x.xPos, yPos: y.yPos - x.yPos }
        let b = { xPos: point.xPos - x.xPos, yPos: point.yPos - x.yPos }
        if ((a.xPos * b.yPos - a.yPos * b.xPos) > 0) {
            return true
        }
        return false
    }

    // https://calculator.swiftutors.com/circumcircle-of-a-triangle-calculator.html
    static circumCircleRadius(x1, x2, x3) {
        let a = this.euclideanDistance2D(x1, x2)
        let b = this.euclideanDistance2D(x1, x3)
        let c = this.euclideanDistance2D(x2, x3)
        let s = (a + b + c) / 2
        let result = (a * b * c) / (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)))
        return result
    }


    static circumCircleCenter(x1, x2, x3) {

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
        let radius = Math.sqrt(sqrOfR)

        return { xPos: centerXPos, yPos: centerYPos, radius: radius }
    }

    // Returns the polar angle of any vertex with p0 set as origin and vextor representing the x axis direction
    static calculatePolarAngle(p0, vertex, vector = { xPos: 1, yPos: 0 }) {
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

    // Merge two Arrays
    // Input  : Two arrys
    //          - first array is the bigger one  
    // Output : - 1 merged  array 
    //          - 1 empty array

    static union(arr1, arr2) {
        // arr2 not empty
        if (arr2.length > 0) {
            arr2.forEach(element => {
                arr1.push(element)
            })
        }
        arr2 = []
        return [arr1, arr2]
    }

    // input verticies connected throuh Edge , listOfSetObjects
    // output setindices
    static find(edgeVertex, listOfSetObjects) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let setIndexVertex = Infinity
                //iterating through all setObjects in listOfsets
                for (let j = 0; j < listOfSetObjects.length; j++) {
                    // itering through all objs in a single setObject
                    for (let k = 0; k < listOfSetObjects[j].obj.length; k++) {
                        // see UNION definition @MathExtension
                        if (listOfSetObjects[j].obj[k].length !== 0) {
                            let xPos = listOfSetObjects[j].obj[k].xPos
                            let yPos = listOfSetObjects[j].obj[k].yPos
                            // check if current vertex in setObjects.obj matches edgeVertex1 or edgeVertex2
                            // safe setObject.id 
                            if (xPos === edgeVertex.xPos && yPos === edgeVertex.yPos) {
                                setIndexVertex = listOfSetObjects[j].id
                                resolve(setIndexVertex)
                            }

                        }
                    }
                }
                reject(null)
            }, 0)
        })
    }
    static generateMstNodeList(mst) {
        let mstVertexList = []
        for (let i = 0; i < mst.length; i++) {
            let nodeOne = new Node(mst[i].vertexOne.xPos, mst[i].vertexOne.yPos, mst[i].vertexOne.id)
            let nodeTwo = new Node(mst[i].vertexTwo.xPos, mst[i].vertexTwo.yPos, mst[i].vertexTwo.id)

            this.add(nodeOne, mstVertexList)
            this.add(nodeTwo, mstVertexList)
        }
        return mstVertexList
    }
    // input  : mst []
    // output : nodeList[{ (v,u), color ......} ] 
    static generateTupelList(mst) {

        let edgeTupel = []
        for (let i = 0; i < mst.length; i++) {
            let tupel = new Tupel()
            tupel.index = i
            tupel.vertexOne.id = mst[i].vertexOne.id
            tupel.vertexOne.xPos = mst[i].vertexOne.xPos
            tupel.vertexOne.yPos = mst[i].vertexOne.yPos

            tupel.vertexTwo.id = mst[i].vertexTwo.id
            tupel.vertexTwo.xPos = mst[i].vertexTwo.xPos
            tupel.vertexTwo.yPos = mst[i].vertexTwo.yPos
            edgeTupel.push(tupel)
        }

        return edgeTupel
    }
    // adding nodes to list without duplicates 
    // kann man locker anders machen, war erste idee doofian
    static add(node, list) {
        let found = list.find(knöten => knöten.xPos === node.xPos && knöten.yPos === node.yPos)
        if (found === undefined) {
            list.push(node)
            return list
        }
    }

    // returns array with i(ndices,vertexOne/Two) of occurence in tupelist
    static findOccurence(node, tupelList) {
        let index = []

        for (let i = 0; i < tupelList.length; i++) {
            if (tupelList[i].vertexOne.xPos === node.xPos && tupelList[i].vertexOne.yPos === node.yPos) {
                index.push([tupelList[i].index, 1])
            } else if (tupelList[i].vertexTwo.xPos === node.xPos && tupelList[i].vertexTwo.yPos === node.yPos) {
                index.push([tupelList[i].index, 2])
            }
        }
        return index
    }

    /**
        * 1) pick random vertex from nodeList
        * 2) search for occurence in Tupel
        *      - Case 1: color = white
        *          - connected node is child
        *          - create child  reference in random vertex to vertex in tupel
        *          - create parent reference in vertex from tupel
        *          - change color to "gray"
        *          - pop random vertex from nodelist
        *
        *     - Case 2: color = gray
        *          - connected node is parent
        *          - check if parent reference is set , if necessary correct it
        * 
        *   repeat till nodeList is empty 
        */

    // return head
    static createTree(nodeList1, tupelObjectList) {
        // need to manage head
        let nodeList = [...nodeList1]
        let head = nodeList[0]
        let queue = []
        queue.push(head)
        // make queue 
        let index = 0
        //while (index < nodeList.length) {
        while (index < queue.length) {
            let node = queue[index]
            // node occurence in tupellist if Found: [[index, vertexNumber],[index, vertexNumber]]
            // else  occurence = []
            let occurence = this.findOccurence(node, tupelObjectList)
            for (let i = 0; i < occurence.length; i++) {
                // index in tupelList
                let tupelIndex = occurence[i][0]
                // "edge" has not been visited yet
                if (tupelObjectList[tupelIndex].color === "white") {
                    // check if current node is tupel.vertexOne
                    if (occurence[i][1] === 1) {
                        //current node is parent of node at tupelObjectList[tupelIndex].vertexTwo
                        //find this one in nodelist
                        let tmpNode = nodeList.find(nöde => nöde.id === tupelObjectList[tupelIndex].vertexTwo.id)
                        // determine Polarangle
                        if (tmpNode !== undefined) {
                            //if (tmpNode.yPos < node.yPos) {
                            if (!(MathExtension.isLeft(tmpNode, node, node.parent))) {
                                if (node.parent) {
                                    tmpNode.polarAngle = this.calculatePolarAngle(node, tmpNode, { xPos: node.parent.xPos - node.xPos, yPos: node.parent.yPos - node.yPos })
                                    tmpNode.polarAngle += 3.1415926535898 // 180 degree in rad
                                }

                            } else {
                                if (node.parent) {
                                    tmpNode.polarAngle = this.calculatePolarAngle(node, tmpNode, { xPos: node.parent.xPos - node.xPos, yPos: node.parent.yPos - node.yPos })
                                }

                            }
                            let duplicate = node.children.find(element => element.xPos === tmpNode.xPos && element.yPos === tmpNode.yPos)
                            if (duplicate === undefined) {
                                node.children.push(tmpNode)
                                queue.push(tmpNode)
                                //(u,v) tupel has been visited => mark it with an gray color 
                                tupelObjectList[tupelIndex].color = "gray"
                            }

                        }
                        // check if current node is tupel.vertexTwo
                    } else if (occurence[i][1] === 2) {
                        //current node is parent of node at tupelObjectList[tupelIndex].vertexOne
                        let tmpNode = nodeList.find(nöde => nöde.id === tupelObjectList[tupelIndex].vertexOne.id)
                        if (tmpNode !== undefined) {
                            if (tmpNode.yPos < node.yPos) {
                                if (node.parent) {
                                    tmpNode.polarAngle = this.calculatePolarAngle(node, tmpNode, { xPos: node.parent.xPos - node.xPos, yPos: node.parent.yPos - node.yPos })
                                    tmpNode.polarAngle += 3.1415926535898 // 180 degree in rad
                                }
                            } else {
                                if (node.parent) {
                                    tmpNode.polarAngle = this.calculatePolarAngle(node, tmpNode, { xPos: node.parent.xPos - node.xPos, yPos: node.parent.yPos - node.yPos })
                                }
                            }
                            let duplicate = node.children.find(element => element.xPos === tmpNode.xPos && element.yPos === tmpNode.yPos)
                            if (duplicate === undefined) {
                                node.children.push(tmpNode)
                                queue.push(tmpNode)
                                //(u,v) tupel has been visited => mark it with an gray color 
                                tupelObjectList[tupelIndex].color = "gray"
                            }
                        }
                    }
                } else if (tupelObjectList[tupelIndex].color === "gray") {
                    // check if current node is tupel.vertexOne
                    if (occurence[i][1] === 1) {
                        //current node is child of node at tupelObjectList[i].vertexTwo
                        let tmpNode = nodeList.find(nöde => nöde.id === tupelObjectList[tupelIndex].vertexTwo.id)
                        if (tmpNode !== undefined) {
                            let duplicate = node.parent.find(element => element.id === tmpNode.id)
                            if (duplicate === undefined) {
                                node.parent.push(tmpNode)
                            }
                        }
                        // check if current node is tupel.vertexTwo
                    } else if (occurence[i][1] === 2) {
                        //current note is child of node at tupelObjectList[i].vertexTwo
                        let tmpNode = nodeList.find(nöde => nöde.id === tupelObjectList[tupelIndex].vertexOne.id)
                        if (tmpNode !== undefined) {
                            let duplicate = node.parent.find(element => element.id === tmpNode.id)
                            if (duplicate === undefined) {
                                node.parent.push(tmpNode)
                            }
                        }
                    }
                }
            }
            // sort children, result :b
            // sorted from right to left , max value is point most right
            node.children.sort((a, b) => a.polarAngle - b.polarAngle)
            index++
        }
        return head
    }
    static hasChildren(node) {
        return node.children.length !== 0 ? true : false
    }
    // input head, visited[], notVisited[]
    // return array in preOder
    static dfsOrder(head, visited, notVisited) {
        let stack = []
        if (head !== undefined) {
            visited.push(head.id)
        }

        //     for (let i = 0; i < head.children.length; i++) {
        //         if (head.children[i].visited === false) {
        //             notVisited.push(head.children[i])
        //         }
        //         if (head.children[i].length === 0) {
        //             console.log("PARENT in FOR: ", head.children[i].parent[0])
        //         }
        //     }
        //     if (notVisited.length > 0) {
        //         let newHead = notVisited.shift()
        //         this.dfsOrder(newHead, visited, notVisited)
        //     }
        // }
        // return visited
    }
    static dfs(mst) {
        try {

            let tupels = this.generateTupelList(mst)
            let nodes = this.generateMstNodeList(mst)
            let head = this.createTree(nodes, tupels)
            let s = []
            let s2 = []
            this.dfsOrder(head, s, s2)
            console.log(head)


        } catch (e) {
            console.log(e)
        }
    }
}


