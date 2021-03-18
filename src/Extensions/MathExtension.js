//TODO look up how to export this properly so that it extends the global object math
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
    // input  : mst []
    // output : nodeList[{ (v,u), color ......} ] 
    static generateTupelList(mst) {
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
        mst.forEach((edge, index) => {
            let tupel = new Tupel()
            tupel.index = index
            tupel.vertexOne.xPos = edge.vertexOne.xPos
            tupel.vertexOne.yPos = edge.vertexOne.yPos

            tupel.vertexTwo.xPos = edge.vertexTwo.xPos
            tupel.vertexTwo.yPos = edge.vertexTwo.yPos
            edgeTupel.push(tupel)
        })

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
    static gernerateMstVertexList(mst) {
        class Node {
            constructor(xPos, yPos) {
                this.xPos = xPos
                this.yPos = yPos
                this.children = []
                this.parent = []
            }
        }
        let mstVertexList = []

        mst.forEach(edge => {
            let nodeOne = new Node(edge.vertexOne.xPos, edge.vertexOne.yPos)
            let nodeTwo = new Node(edge.vertexTwo.xPos, edge.vertexTwo.yPos)

            this.add(nodeOne, mstVertexList)
            this.add(nodeTwo, mstVertexList)
        })
        return mstVertexList
    }
    // returns array with i(ndices,vertexOne/Two) of occurence in tupelist
    static findOccurence(node, tupelList) {
        let index = []
        tupelList.forEach(currentTupel => {
            if (currentTupel.vertexOne.xPos === node.xPos && currentTupel.vertexOne.yPos === node.yPos) {
                index.push([currentTupel.index, 1])
            } else if (currentTupel.vertexTwo.xPos === node.xPos && currentTupel.vertexTwo.yPos === node.yPos) {
                index.push([currentTupel.index, 2])
            }
        })
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


    static createTree(mst) {
        // contains every MST vertex 
        let nodeList = this.gernerateMstVertexList(mst)
        // contains every tupel( (u,v), color) e MST 
        let tupelList = this.generateTupelList(mst)

        let head = null

        while (nodeList.length > 0) {
            let node = nodeList.shift()
            let occurence = this.findOccurence(node, tupelList)
            for (let i = 0; i < occurence.length; i++) {
                if (tupelList[i].color === "white") {
                    // check if current node is tupel.vertexOne
                    if (occurence[i][1] === 1) {
                        console.log("")
                        // check if current node is tupel.vertexOne
                    } else if (occurence[i][1] === 2) {
                        console.log("")
                    }
                } else if (tupelList[i].color === "gray") {
                    console.log("")
                }
            }
        }
    }
    static dfs() {
        return Promise((resolve, reject) => {

            setTimeout(() => {
            }, 0)
        })
    }

}

